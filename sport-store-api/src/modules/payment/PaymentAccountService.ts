import { HttpException } from "../../shared/HttpException.js";
import { PaymentAccountRepository } from "./PaymentAccountRepository.js";
import {
  BANK_LINE_MIDS,
  type PaymentAccountEntity,
  type BankChatEntity,
} from "./PaymentAccountSchema.js";

export class PaymentAccountService {
  private readonly repository: PaymentAccountRepository;

  constructor() {
    this.repository = new PaymentAccountRepository();
  }

  public async getAll() {
    return this.repository.findAllWithBanks();
  }

  public async getById(id: string) {
    const acc = await this.repository.findById(id);
    if (!acc) throw HttpException.notFound("ไม่พบบัญชี");
    const banks = await this.repository.getBankChats(id);
    return { ...acc, bank_chats: banks };
  }

  public async getActive() {
    return this.repository.findActive();
  }

  public async create(
    data: Partial<PaymentAccountEntity>
  ): Promise<PaymentAccountEntity> {
    return this.repository.create(data);
  }

  public async update(
    id: string,
    data: Partial<PaymentAccountEntity>
  ): Promise<PaymentAccountEntity> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  public async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }

  public async addBankChat(
    accountId: string,
    data: { bank_code: string; is_active?: boolean }
  ): Promise<BankChatEntity> {
    await this.getById(accountId);

    const bankInfo = BANK_LINE_MIDS[data.bank_code];
    if (!bankInfo) {
      throw HttpException.badRequest(
        `ไม่รองรับธนาคาร "${data.bank_code}" — ใช้ได้: ${Object.keys(BANK_LINE_MIDS).join(", ")}`
      );
    }

    return this.repository.addBankChat({
      account_id: accountId,
      bank_code: data.bank_code,
      bank_name: bankInfo.name,
      line_chat_mid: bankInfo.mid,
      is_active: data.is_active ?? true,
    });
  }

  public async removeBankChat(chatId: string): Promise<void> {
    await this.repository.removeBankChat(chatId);
  }

  public async getActiveBankMids(accountId: string): Promise<string[]> {
    return this.repository.getActiveBankMids(accountId);
  }
}
