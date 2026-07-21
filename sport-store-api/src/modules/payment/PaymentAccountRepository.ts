import { BaseRepository } from "../../shared/BaseRepository.js";
import { Database } from "../../config/Database.js";
import type {
  PaymentAccountEntity,
  BankChatEntity,
} from "./PaymentAccountSchema.js";

export class PaymentAccountRepository extends BaseRepository<PaymentAccountEntity> {
  constructor() {
    super("payment_accounts");
  }

  public async findActive(): Promise<PaymentAccountEntity | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find active account: ${error.message}`);
    }
    return data as PaymentAccountEntity;
  }

  public async findAllWithBanks(): Promise<
    (PaymentAccountEntity & { bank_chats: BankChatEntity[] })[]
  > {
    const { data: accounts, error } = await this.table
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch accounts: ${error.message}`);

    const db = Database.getInstance().getAdminClient();
    const result: (PaymentAccountEntity & {
      bank_chats: BankChatEntity[];
    })[] = [];

    for (const acc of (accounts as PaymentAccountEntity[]) ?? []) {
      const { data: banks } = await db
        .from("bank_chats")
        .select("*")
        .eq("account_id", acc.id)
        .order("created_at", { ascending: true });

      result.push({
        ...acc,
        bank_chats: (banks as BankChatEntity[]) ?? [],
      });
    }
    return result;
  }

  public async getBankChats(accountId: string): Promise<BankChatEntity[]> {
    const db = Database.getInstance().getAdminClient();
    const { data, error } = await db
      .from("bank_chats")
      .select("*")
      .eq("account_id", accountId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to fetch bank chats: ${error.message}`);
    return (data as BankChatEntity[]) ?? [];
  }

  public async getActiveBankMids(accountId: string): Promise<string[]> {
    const db = Database.getInstance().getAdminClient();
    const { data, error } = await db
      .from("bank_chats")
      .select("line_chat_mid")
      .eq("account_id", accountId)
      .eq("is_active", true);

    if (error) return [];
    return (data ?? []).map(
      (d: { line_chat_mid: string }) => d.line_chat_mid
    );
  }

  public async addBankChat(
    chat: Partial<BankChatEntity>
  ): Promise<BankChatEntity> {
    const db = Database.getInstance().getAdminClient();
    const { data, error } = await db
      .from("bank_chats")
      .insert(chat as Record<string, unknown>)
      .select()
      .single();

    if (error) throw new Error(`Failed to add bank chat: ${error.message}`);
    return data as BankChatEntity;
  }

  public async removeBankChat(chatId: string): Promise<void> {
    const db = Database.getInstance().getAdminClient();
    const { error } = await db.from("bank_chats").delete().eq("id", chatId);
    if (error)
      throw new Error(`Failed to remove bank chat: ${error.message}`);
  }

  public async updateLineAuth(
    accountId: string,
    authToken: string,
    connected: boolean,
    refreshToken?: string | null,
    expiresAt?: string | null
  ): Promise<void> {
    const payload: Record<string, unknown> = {
      line_auth_token: authToken,
      line_connected: connected,
      updated_at: new Date().toISOString(),
    };
    if (refreshToken !== undefined) payload.line_refresh_token = refreshToken;
    if (expiresAt !== undefined) payload.line_token_expires_at = expiresAt;

    await this.table.update(payload).eq("id", accountId);
  }

  public async updateAuthToken(
    accountId: string,
    authToken: string
  ): Promise<void> {
    await this.table
      .update({
        line_auth_token: authToken,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId);
  }
}
