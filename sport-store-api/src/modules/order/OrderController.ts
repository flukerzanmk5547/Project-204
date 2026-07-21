import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { OrderService } from "./OrderService.js";
import { OrderSchema } from "./OrderSchema.js";

interface AuthRequest extends FastifyRequest {
  user?: { id: string };
}

export class OrderController extends BaseController {
  private readonly service: OrderService;

  constructor() {
    super();
    this.service = new OrderService();
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user?.id ?? null;
    const parsed = OrderSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const order = await this.service.create(userId, parsed.data);
    this.sendCreated(reply, order);
  }

  public async getHistory(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user!.id;
    const { page = 1, limit = 20 } = request.query as {
      page?: number;
      limit?: number;
    };
    const result = await this.service.getHistory(userId, +page, +limit);
    this.sendSuccess(reply, result);
  }

  public async getDetail(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user!.id;
    const { id } = request.params as { id: string };
    const order = await this.service.getDetail(userId, id);
    this.sendSuccess(reply, order);
  }

  public async updateStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    if (!status) {
      throw HttpException.badRequest("กรุณาระบุสถานะ");
    }
    const order = await this.service.updateStatus(id, status);
    this.sendSuccess(reply, order);
  }
}
