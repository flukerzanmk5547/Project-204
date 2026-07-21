import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { PaymentAccountService } from "./PaymentAccountService.js";
import { PaymentAccountSchema, BANK_LINE_MIDS } from "./PaymentAccountSchema.js";
import { getLineBotInstance } from "./LineBotService.js";

export class PaymentAccountController extends BaseController {
  private readonly service: PaymentAccountService;

  constructor() {
    super();
    this.service = new PaymentAccountService();
  }

  public async getAll(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const accounts = await this.service.getAll();
    const safe = accounts.map((a) => ({
      ...a,
      line_auth_token: a.line_auth_token ? "***" : null,
      line_refresh_token: a.line_refresh_token ? "***" : null,
    }));
    this.sendSuccess(reply, safe);
  }

  public async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const account = await this.service.getById(id);
    this.sendSuccess(reply, {
      ...account,
      line_auth_token: account.line_auth_token ? "***" : null,
      line_refresh_token: account.line_refresh_token ? "***" : null,
    });
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = PaymentAccountSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const account = await this.service.create(parsed.data);
    this.sendCreated(reply, account);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const parsed = PaymentAccountSchema.update.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const account = await this.service.update(id, parsed.data);
    this.sendSuccess(reply, account);
  }

  public async remove(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    await this.service.remove(id);
    this.sendNoContent(reply);
  }

  public async addBankChat(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const parsed = PaymentAccountSchema.addBankChat.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const chat = await this.service.addBankChat(id, parsed.data);
    this.sendCreated(reply, chat);
  }

  public async removeBankChat(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { chatId } = request.params as { chatId: string };
    await this.service.removeBankChat(chatId);
    this.sendNoContent(reply);
  }

  /**
   * เริ่ม LINE QR login flow
   * ส่ง QR URL กลับไปให้ admin สแกน
   */
  public async lineLogin(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    await this.service.getById(id);

    const bot = getLineBotInstance();
    const result = await bot.startQRLogin(id);

    this.sendSuccess(reply, result);
  }

  /**
   * เช็คสถานะ LINE connection ของ account
   */
  public async lineStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const account = await this.service.getById(id);
    const bot = getLineBotInstance();
    const botStatus = bot.getAccountStatus(id);

    this.sendSuccess(reply, {
      account_id: id,
      line_connected: account.line_connected,
      bot_listening: botStatus.listening,
      bank_chats: account.bank_chats,
    });
  }

  /**
   * หยุด LINE connection
   */
  public async lineDisconnect(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const bot = getLineBotInstance();
    bot.stopAccount(id);
    this.sendMessage(reply, "ตัดการเชื่อมต่อ LINE สำเร็จ");
  }

  public async supportedBanks(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const banks = Object.entries(BANK_LINE_MIDS).map(([code, info]) => ({
      bank_code: code,
      bank_name: info.name,
    }));
    this.sendSuccess(reply, banks);
  }
}
