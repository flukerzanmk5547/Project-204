import { PaymentService } from "./PaymentService.js";
import { PaymentAccountRepository } from "./PaymentAccountRepository.js";

interface LineClient {
  authToken: string;
  on: (
    event: string,
    handler: (data: unknown) => void
  ) => void;
  listen: (opts: {
    talk: boolean;
    square: boolean;
    signal?: AbortSignal;
  }) => void;
  base: {
    talk: {
      getMessageBoxes: (arg: unknown) => Promise<{
        messageBoxes: Array<{
          id: string;
          lastDeliveredMessageId: { deliveredTime: unknown; messageId: number };
        }>;
      }>;
      getPreviousMessagesV2WithRequest: (arg: unknown) => Promise<
        Array<{
          id: string;
          from: string;
          to: string;
          text: string;
          contentType: string;
          deliveredTime: unknown;
          contentMetadata: Record<string, string>;
        }>
      >;
    };
  };
}

interface AccountSession {
  accountId: string;
  client: LineClient;
  listening: boolean;
  bankMids: Set<string>;
  abortController: AbortController | null;
  refreshTimer: ReturnType<typeof setInterval> | null;
  pollTimer: ReturnType<typeof setInterval> | null;
  lastSeenMessageIds: Set<string>;
}

export class LineBotService {
  private sessions = new Map<string, AccountSession>();
  private readonly paymentService: PaymentService;
  private readonly accountRepo: PaymentAccountRepository;

  private pendingQR: {
    accountId: string;
    qrUrl: string | null;
    pincode: string | null;
    status: "waiting_qr" | "waiting_pin" | "connected" | "error";
    error?: string;
  } | null = null;

  constructor() {
    this.paymentService = new PaymentService();
    this.accountRepo = new PaymentAccountRepository();
  }

  private parseAmountFromMessage(text: string): number | null {
    const patterns = [
      /(?:รับเงิน|ได้รับ|เงินเข้า|โอนเข้า|received)[^\d]*?([\d,]+(?:\.\d{2})?)\s*(?:บาท|THB|baht)/i,
      /(?:จำนวน|amount)[^\d]*?([\d,]+(?:\.\d{2})?)\s*(?:บาท|THB|baht)/i,
      /\+\s*([\d,]+(?:\.\d{2})?)\s*(?:บาท|THB|baht)?/,
      /([\d,]+\.\d{2})\s*(?:บาท|THB|baht)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ""));
        if (!isNaN(amount) && amount > 0) return amount;
      }
    }
    return null;
  }

  private isIncomingTransfer(text: string): boolean {
    const incoming = [
      "รับเงิน",
      "ได้รับ",
      "เงินเข้า",
      "โอนเข้า",
      "received",
      "credit",
      "cash in",
    ];
    const outgoing = [
      "โอนเงิน",
      "ชำระเงิน",
      "เงินออก",
      "หักเงิน",
      "debit",
      "payment",
      "cash out",
    ];
    const lower = text.toLowerCase();
    const hasIn = incoming.some((k) => lower.includes(k));
    const hasOut = outgoing.some((k) => lower.includes(k));
    if (hasIn && !hasOut) return true;
    if (lower.includes("+") && !lower.includes("-")) return true;
    return false;
  }

  private extractTextFromFlex(flexJson: string): string | null {
    try {
      const flex = JSON.parse(flexJson);
      const texts: string[] = [];
      this.collectFlexTexts(flex, texts);
      return texts.length > 0 ? texts.join(" ") : null;
    } catch {
      return null;
    }
  }

  private collectFlexTexts(
    node: Record<string, unknown>,
    out: string[]
  ): void {
    if (!node || typeof node !== "object") return;

    if (node.type === "text" && typeof node.text === "string") {
      out.push(node.text);
    }

    if (Array.isArray(node.contents)) {
      for (const child of node.contents) {
        this.collectFlexTexts(child as Record<string, unknown>, out);
      }
    }

    for (const key of ["header", "body", "footer", "hero"]) {
      if (node[key] && typeof node[key] === "object") {
        this.collectFlexTexts(node[key] as Record<string, unknown>, out);
      }
    }

    if (node.action && typeof node.action === "object") {
      const action = node.action as Record<string, unknown>;
      if (typeof action.label === "string") {
        out.push(action.label);
      }
    }
  }

  public async startQRLogin(
    accountId: string
  ): Promise<{
    status: string;
    qr_url?: string;
    pincode?: string;
    message: string;
  }> {
    if (this.pendingQR && this.pendingQR.accountId !== accountId) {
      return {
        status: "error",
        message: "มี account อื่นกำลัง login อยู่ กรุณารอสักครู่",
      };
    }

    this.pendingQR = {
      accountId,
      qrUrl: null,
      pincode: null,
      status: "waiting_qr",
    };

    this.doQRLogin(accountId).catch((err) => {
      console.error("[LineBotService] QR login error:", err);
      if (this.pendingQR) {
        this.pendingQR.status = "error";
        this.pendingQR.error = String(err);
      }
    });

    await new Promise((r) => setTimeout(r, 3000));

    if (this.pendingQR?.qrUrl) {
      return {
        status: "waiting_qr",
        qr_url: this.pendingQR.qrUrl,
        pincode: this.pendingQR.pincode || undefined,
        message: "กรุณาสแกน QR Code ด้วยแอป LINE",
      };
    }

    if (this.pendingQR?.pincode) {
      return {
        status: "waiting_pin",
        pincode: this.pendingQR.pincode,
        message: `กรุณาใส่รหัส ${this.pendingQR.pincode} ในแอป LINE`,
      };
    }

    if (this.pendingQR?.status === "connected") {
      return { status: "connected", message: "เชื่อมต่อ LINE สำเร็จ" };
    }

    return {
      status: this.pendingQR?.status || "waiting_qr",
      message: "กำลังสร้าง QR Code... กรุณา poll endpoint นี้อีกครั้ง",
    };
  }

  private async doQRLogin(accountId: string): Promise<void> {
    const { loginWithQR, loginWithAuthToken } = await import("@evex/linejs");
    const { FileStorage } = await import("@evex/linejs/storage");

    const storageFile = `./line_storage_${accountId}.json`;
    const storage = new FileStorage(storageFile);

    const account = await this.accountRepo.findById(accountId);


    if (account?.line_auth_token) {
      try {
        const tokenInput: { accessToken: string; refreshToken?: string } = {
          accessToken: account.line_auth_token,
        };
        if (account.line_refresh_token) {
          tokenInput.refreshToken = account.line_refresh_token;
        }

        const client = await loginWithAuthToken(tokenInput, {
          device: (account.line_device || "IOSIPAD") as "IOSIPAD",
          storage,
        });

        await this.onLoginSuccess(accountId, client as LineClient, storage);
        return;
      } catch (err) {
        console.log(
          `[LineBotService] Saved token failed: ${err}. Falling back to QR login.`
        );
      }
    }

    const client = await loginWithQR(
      {
        onReceiveQRUrl: (qrUrl: string) => {
          console.log(`[LineBotService] QR URL: ${qrUrl}`);
          if (this.pendingQR) {
            this.pendingQR.qrUrl = qrUrl;
          }
        },
        onPincodeRequest: (pincode: string) => {
          console.log(`[LineBotService] Enter PIN in LINE app: ${pincode}`);
          if (this.pendingQR) {
            this.pendingQR.pincode = pincode;
            this.pendingQR.status = "waiting_pin";
          }
        },
      },
      {
        device: "IOSIPAD",
        storage,
      }
    );

    await this.onLoginSuccess(accountId, client as LineClient, storage);
  }

  private async onLoginSuccess(
    accountId: string,
    client: LineClient,
    storage: { get: (key: string) => Promise<unknown> }
  ): Promise<void> {
    const refreshToken = await storage.get("refreshToken");
    const expireRaw = await storage.get("expire");
    const expiresAt =
      typeof expireRaw === "number"
        ? new Date(expireRaw * 1000).toISOString()
        : null;

    await this.accountRepo.updateLineAuth(
      accountId,
      client.authToken,
      true,
      refreshToken ? String(refreshToken) : null,
      expiresAt
    );

    client.on("update:authtoken", async (newToken: unknown) => {
      if (typeof newToken !== "string") return;
      console.log(
        `[LineBotService] [${accountId}] Token refreshed automatically`
      );
      try {
        await this.accountRepo.updateAuthToken(accountId, newToken);
        const session = this.sessions.get(accountId);
        if (session) {
          (session.client as LineClient).authToken = newToken;
        }
      } catch (err) {
        console.error(
          `[LineBotService] Failed to persist refreshed token:`,
          err
        );
      }
    });

    if (this.pendingQR?.accountId === accountId) {
      this.pendingQR.status = "connected";
    }
    this.pendingQR = null;

    const bankMids = await this.accountRepo.getActiveBankMids(accountId);

    const abortController = new AbortController();

    let refreshTimer: ReturnType<typeof setInterval> | null = null;
    if (typeof expireRaw === "number") {
      refreshTimer = this.scheduleTokenRefresh(accountId, expireRaw);
    }

    const session: AccountSession = {
      accountId,
      client,
      listening: true,
      bankMids: new Set(bankMids),
      abortController,
      refreshTimer,
      pollTimer: null,
      lastSeenMessageIds: new Set<string>(),
    };
    this.sessions.set(accountId, session);

    console.log(
      `[LineBotService] Account ${accountId} connected. Monitoring ${bankMids.length} bank chats.`
    );

    // OA (official account) messages ไม่ fire ผ่าน event listener
    // ใช้ polling ดึง message ใหม่จาก bank chats ทุก 5 วินาทีแทน
    await this.initPolling(session);
  }

  /**
   * Polling: ดึง message ใหม่จาก bank chats ทุก POLL_INTERVAL_MS
   */
  private static readonly POLL_INTERVAL_MS = 5_000;

  private async initPolling(session: AccountSession): Promise<void> {
    // ดึง message ปัจจุบันเพื่อ mark เป็น "seen" (ไม่ process ย้อนหลัง)
    await this.seedLastSeenMessages(session);

    session.pollTimer = setInterval(async () => {
      if (!session.listening) return;
      try {
        await this.pollBankMessages(session);
      } catch (err) {
        console.error(
          `[LineBotService] [${session.accountId}] Poll error:`,
          err
        );
      }
    }, LineBotService.POLL_INTERVAL_MS);

    console.log(
      `[LineBotService] [${session.accountId}] Polling started (every ${LineBotService.POLL_INTERVAL_MS}ms)`
    );
  }

  private async seedLastSeenMessages(session: AccountSession): Promise<void> {
    const { client } = session;
    try {
      const boxes = await client.base.talk.getMessageBoxes({
        messageBoxListRequest: {},
      });

      for (const bankMid of session.bankMids) {
        const box = boxes.messageBoxes.find((b) => b.id === bankMid);
        if (!box) continue;

        const msgs =
          await client.base.talk.getPreviousMessagesV2WithRequest({
            request: {
              messageBoxId: box.id,
              endMessageId: box.lastDeliveredMessageId,
              messagesCount: 5,
            },
          });

        for (const m of msgs) {
          session.lastSeenMessageIds.add(m.id);
        }
      }
    } catch (err) {
      console.error(
        `[LineBotService] [${session.accountId}] Seed seen IDs error:`,
        err
      );
    }
  }

  private async pollBankMessages(session: AccountSession): Promise<void> {
    const { client } = session;

    const boxes = await client.base.talk.getMessageBoxes({
      messageBoxListRequest: {},
    });

    for (const bankMid of session.bankMids) {
      const box = boxes.messageBoxes.find((b) => b.id === bankMid);
      if (!box) continue;

      const msgs =
        await client.base.talk.getPreviousMessagesV2WithRequest({
          request: {
            messageBoxId: box.id,
            endMessageId: box.lastDeliveredMessageId,
            messagesCount: 3,
          },
        });

      for (const msg of msgs) {
        if (session.lastSeenMessageIds.has(msg.id)) continue;
        session.lastSeenMessageIds.add(msg.id);

        // trim seen set เก็บแค่ 100 ล่าสุด
        if (session.lastSeenMessageIds.size > 100) {
          const arr = [...session.lastSeenMessageIds];
          session.lastSeenMessageIds = new Set(arr.slice(-100));
        }

        await this.processMessage(session, msg);
      }
    }
  }

  private async processMessage(
    session: AccountSession,
    msg: {
      id: string;
      from: string;
      text: string;
      contentType: string;
      contentMetadata: Record<string, string>;
    }
  ): Promise<void> {
    try {
      let text = msg.text || "";

      if (!text && msg.contentMetadata?.FLEX_JSON) {
        text =
          this.extractTextFromFlex(msg.contentMetadata.FLEX_JSON) || "";
      }

      if (!text) return;

      console.log(
        `[LineBotService] [${session.accountId}] New message from ${msg.from}: ${text.substring(0, 120)}`
      );

      if (!this.isIncomingTransfer(text)) return;

      const amount = this.parseAmountFromMessage(text);
      if (!amount) return;

      console.log(
        `[LineBotService] [${session.accountId}] Detected incoming: ฿${amount}`
      );

      const confirmed = await this.paymentService.confirmPayment(
        amount,
        msg.id || `line_${Date.now()}`,
        text.substring(0, 500)
      );

      if (confirmed) {
        console.log(
          `[LineBotService] Payment confirmed! Order: ${confirmed.order_id}`
        );
      }
    } catch (err) {
      console.error("[LineBotService] Process message error:", err);
    }
  }
  private scheduleTokenRefresh(
    accountId: string,
    expireEpochSec: number
  ): ReturnType<typeof setInterval> {
    const REFRESH_BEFORE_SEC = 5 * 60; 

    const checkInterval = setInterval(async () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = expireEpochSec - now;

      if (timeLeft <= REFRESH_BEFORE_SEC) {
        console.log(
          `[LineBotService] [${accountId}] Token expiring soon (${timeLeft}s left), refreshing...`
        );
        try {
          const session = this.sessions.get(accountId);
          if (session?.client) {
            const client = session.client as unknown as {
              auth?: { tryRefreshToken: () => Promise<void> };
            };
            if (client.auth?.tryRefreshToken) {
              await client.auth.tryRefreshToken();
              console.log(
                `[LineBotService] [${accountId}] Token refreshed via proactive timer`
              );
            }
          }
        } catch (err) {
          console.error(
            `[LineBotService] [${accountId}] Proactive refresh failed:`,
            err
          );
        }
      }
    }, 60_000); 

    return checkInterval;
  }

  public async autoStart(): Promise<void> {
    const accounts = await this.accountRepo.findAllWithBanks();
    for (const acc of accounts) {
      if (acc.is_active && acc.line_auth_token && acc.line_connected) {
        console.log(
          `[LineBotService] Auto-connecting account: ${acc.label}`
        );
        this.doQRLogin(acc.id).catch((err) => {
          console.error(
            `[LineBotService] Auto-connect failed for ${acc.label}:`,
            err
          );
        });
      }
    }
  }

  public getAccountStatus(accountId: string): { listening: boolean } {
    const session = this.sessions.get(accountId);
    return { listening: session?.listening ?? false };
  }

  public stopAccount(accountId: string): void {
    const session = this.sessions.get(accountId);
    if (session) {
      session.abortController?.abort();
      if (session.refreshTimer) clearInterval(session.refreshTimer);
      if (session.pollTimer) clearInterval(session.pollTimer);
      session.listening = false;
      this.sessions.delete(accountId);
      this.accountRepo
        .updateLineAuth(accountId, "", false)
        .catch(() => {});
      console.log(`[LineBotService] Account ${accountId} stopped`);
    }
  }

  public getStatus(): {
    accounts: { id: string; listening: boolean }[];
  } {
    const accounts = Array.from(this.sessions.entries()).map(
      ([id, session]) => ({
        id,
        listening: session.listening,
      })
    );
    return { accounts };
  }

  public async refreshBankMids(accountId: string): Promise<void> {
    const session = this.sessions.get(accountId);
    if (!session) return;
    const mids = await this.accountRepo.getActiveBankMids(accountId);
    session.bankMids = new Set(mids);
    console.log(
      `[LineBotService] Refreshed bank MIDs for ${accountId}: ${mids.length} chats`
    );
  }
}

let instance: LineBotService | null = null;

export function getLineBotInstance(): LineBotService {
  if (!instance) {
    instance = new LineBotService();
  }
  return instance;
}
