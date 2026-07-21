import { z } from "zod";

export class PaymentSchema {
  public static readonly create = z.object({
    order_id: z.string().uuid(),
    amount: z.number().positive("จำนวนเงินต้องมากกว่า 0"),
  });
}

export interface PaymentEntity {
  id: string;
  order_id: string | null;
  method: string;
  amount: number;
  ref_amount: number;
  status: string;
  promptpay_number: string | null;
  qr_payload: string | null;
  line_message_id: string | null;
  line_matched_text: string | null;
  expires_at: string;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CreatePaymentDto = z.infer<typeof PaymentSchema.create>;
