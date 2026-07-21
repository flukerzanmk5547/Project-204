import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { PaymentService } from "./PaymentService.js";
import { PaymentSchema } from "./PaymentSchema.js";
import { getLineBotInstance } from "./LineBotService.js";

export class PaymentController extends BaseController {
  private readonly service: PaymentService;

  constructor() {
    super();
    this.service = new PaymentService();
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = PaymentSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const result = await this.service.createPayment(parsed.data);
    this.sendCreated(reply, {
      payment: result.payment,
      qr_image: result.qr_image,
    });
  }

  public async checkStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const payment = await this.service.checkStatus(id);
    this.sendSuccess(reply, payment);
  }

  public async getByOrder(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { orderId } = request.params as { orderId: string };
    const payment = await this.service.getByOrderId(orderId);
    if (!payment) throw HttpException.notFound("ไม่พบการชำระเงิน");
    this.sendSuccess(reply, payment);
  }

  public async getBotStatus(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const bot = getLineBotInstance();
    this.sendSuccess(reply, bot.getStatus());
  }

  public async manualConfirm(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const payment = await this.service.checkStatus(id);
    if (payment.status !== "pending") {
      throw HttpException.badRequest("การชำระเงินนี้ไม่อยู่ในสถานะรอดำเนินการ");
    }
    const confirmed = await this.service.confirmPayment(
      payment.ref_amount,
      "manual",
      "Admin manual confirmation"
    );
    if (!confirmed) throw HttpException.notFound("ไม่พบการชำระเงิน");
    this.sendSuccess(reply, confirmed);
  }
}
