import { z } from "zod";

export const BANK_LINE_MIDS: Record<string, { mid: string; name: string }> = {
  scb:   { mid: "u4ca19114ed596ee2f4e63335ec7143fb", name: "ไทยพาณิชย์ (SCB)" },
  ktb:   { mid: "uce372f6ada1d1a0855973fefc2942f9a", name: "กรุงไทย (KTB)" },
  kbank: { mid: "u8cc52e369d2bca4a5ce8c506170c712e", name: "กสิกรไทย (KBank)" },
  gsb:   { mid: "ub2a0ffaaab7e5bdd10814ec88afe67fc", name: "ออมสิน (GSB)" },
};

const validBankCodes = Object.keys(BANK_LINE_MIDS) as [string, ...string[]];

export class PaymentAccountSchema {
  public static readonly create = z.object({
    label: z.string().min(1, "กรุณาระบุชื่อบัญชี"),
    promptpay_number: z.string().min(10, "เลขพร้อมเพย์ไม่ถูกต้อง"),
    is_active: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  });

  public static readonly update = PaymentAccountSchema.create.partial();

  public static readonly addBankChat = z.object({
    bank_code: z.enum(validBankCodes, {
      errorMap: () => ({
        message: `bank_code ต้องเป็น: ${validBankCodes.join(", ")}`,
      }),
    }),
    is_active: z.boolean().optional(),
  });
}

export interface PaymentAccountEntity {
  id: string;
  label: string;
  promptpay_number: string;
  is_active: boolean;
  line_auth_token: string | null;
  line_refresh_token: string | null;
  line_token_expires_at: string | null;
  line_device: string;
  line_connected: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BankChatEntity {
  id: string;
  account_id: string;
  bank_code: string;
  bank_name: string;
  line_chat_mid: string;
  is_active: boolean;
  created_at: string;
}
