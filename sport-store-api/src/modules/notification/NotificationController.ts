import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { NotificationService } from "./NotificationService.js";
import { NotificationSchema } from "./NotificationSchema.js";

export class NotificationController extends BaseController {
  private readonly service: NotificationService;

  constructor() {
    super();
    this.service = new NotificationService();
  }

  public async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = NotificationSchema.query.safeParse(request.query);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const result = await this.service.list(parsed.data);
    this.sendSuccess(reply, result);
  }

  public async getUnreadCount(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const result = await this.service.getUnreadCount();
    this.sendSuccess(reply, result);
  }

  public async markRead(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = NotificationSchema.params.parse(
      request.params as Record<string, string>
    );
    const notification = await this.service.markRead(id);
    this.sendSuccess(reply, notification);
  }

  public async markAllRead(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    await this.service.markAllRead();
    this.sendMessage(reply, "อ่านการแจ้งเตือนทั้งหมดแล้ว");
  }
}
