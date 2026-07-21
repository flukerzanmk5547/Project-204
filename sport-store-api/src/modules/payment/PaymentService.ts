import generatePayload from "promptpay-qr";
import QRCode from "qrcode";
import { HttpException } from "../../shared/HttpException.js";
import { Environment } from "../../config/Environment.js";
import { PaymentRepository } from "./PaymentRepository.js";
import { PaymentAccountRepository } from "./PaymentAccountRepository.js";
import type { PaymentEntity, CreatePaymentDto } from "./PaymentSchema.js";

export class PaymentService {
  private readonly repository: PaymentRepository;
  private readonly accountRepo: PaymentAccountRepository;
  private readonly paymentTimeout: number;

  constructor() {
    this.repository = new PaymentRepository();
    this.accountRepo = new PaymentAccountRepository();
    this.paymentTimeout = 15 * 60 * 1000;
  }

  /**
   * สร้าง ref_amount ที่ไม่ซ้ำกัน โดยเพิ่มสตางค์สุ่ม .01 - .99
   * เพื่อให้จับคู่กับยอดโอนจริงได้
   */
  private async generateUniqueRefAmount(baseAmount: number): Promise<number> {
    for (let attempt = 0; attempt < 50; attempt++) {
      const satang = Math.floor(Math.random() * 99) + 1;
      const ref = parseFloat(
        (Math.floor(baseAmount) + satang / 100).toFixed(2)
      );

      const inUse = await this.repository.isRefAmountInUse(ref);
      if (!inUse) return ref;
    }
    return parseFloat((baseAmount + 0.01).toFixed(2));
  }

  public async createPayment(
    dto: CreatePaymentDto
  ): Promise<{
    payment: PaymentEntity;
    qr_image: string;
  }> {
    await this.repository.expireOldPayments();

    const existing = await this.repository.findPendingByOrderId(dto.order_id);
    if (existing) {
      const qrImage = await QRCode.toDataURL(existing.qr_payload!, {
        width: 400,
        margin: 2,
      });
      return { payment: existing, qr_image: qrImage };
    }

    const activeAccount = await this.accountRepo.findActive();
    if (!activeAccount) {
      throw HttpException.badRequest(
        "ไม่มีบัญชีชำระเงินที่เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ"
      );
    }

    const env = Environment.getInstance();
    const baseAmount = env.isUAT ? env.uatFixedAmount : dto.amount;
    const refAmount = await this.generateUniqueRefAmount(baseAmount);

    if (env.isUAT) {
      console.log(
        `[UAT] Payment: original ฿${dto.amount} → QR fixed ฿${refAmount}`
      );
    }

    const qrPayload = generatePayload(activeAccount.promptpay_number, {
      amount: refAmount,
    });

    const qrImage = await QRCode.toDataURL(qrPayload, {
      width: 400,
      margin: 2,
    });

    const expiresAt = new Date(Date.now() + this.paymentTimeout).toISOString();

    const payment = await this.repository.create({
      order_id: dto.order_id,
      method: "promptpay",
      amount: dto.amount,
      ref_amount: refAmount,
      status: "pending",
      promptpay_number: activeAccount.promptpay_number,
      qr_payload: qrPayload,
      account_id: activeAccount.id,
      expires_at: expiresAt,
      is_test: env.isUAT,
    } as Partial<PaymentEntity>);

    if (env.uatAutoConfirmPayment) {
      this.scheduleAutoConfirm(payment.id, refAmount, env.uatAutoConfirmDelayMs);
    }

    return { payment, qr_image: qrImage };
  }

  /**
   * UAT only: auto-confirm หลังจากรอ delay
   */
  private scheduleAutoConfirm(
    paymentId: string,
    refAmount: number,
    delayMs: number
  ): void {
    console.log(
      `[UAT] Auto-confirm scheduled for payment ${paymentId} in ${delayMs}ms`
    );
    setTimeout(async () => {
      try {
        const payment = await this.repository.findById(paymentId);
        if (payment?.status !== "pending") return;

        const confirmed = await this.confirmPayment(
          refAmount,
          `uat_auto_${Date.now()}`,
          "[UAT] Auto-confirmed payment"
        );
        if (confirmed) {
          console.log(
            `[UAT] Auto-confirmed payment ${paymentId} (order: ${confirmed.order_id})`
          );
        }
      } catch (err) {
        console.error(`[UAT] Auto-confirm failed for ${paymentId}:`, err);
      }
    }, delayMs);
  }

  public async checkStatus(paymentId: string): Promise<PaymentEntity> {
    const payment = await this.repository.findById(paymentId);
    if (!payment) throw HttpException.notFound("ไม่พบข้อมูลการชำระเงิน");

    if (
      payment.status === "pending" &&
      new Date(payment.expires_at) < new Date()
    ) {
      return this.repository.update(paymentId, {
        status: "expired",
      } as Partial<PaymentEntity>);
    }
    return payment;
  }

  public async confirmPayment(
    refAmount: number,
    lineMessageId: string,
    matchedText: string
  ): Promise<PaymentEntity | null> {
    const payment = await this.repository.findPendingByRefAmount(refAmount);
    if (!payment) return null;

    const confirmed = await this.repository.update(payment.id, {
      status: "confirmed",
      line_message_id: lineMessageId,
      line_matched_text: matchedText,
      confirmed_at: new Date().toISOString(),
    } as Partial<PaymentEntity>);

    if (confirmed.order_id) {
      const { Database } = await import("../../config/Database.js");
      const db = Database.getInstance().getAdminClient();
      await db
        .from("orders")
        .update({ status: "confirmed" })
        .eq("id", confirmed.order_id);
    }

    return confirmed;
  }

  public async getByOrderId(orderId: string): Promise<PaymentEntity | null> {
    return this.repository.findPendingByOrderId(orderId);
  }
}
