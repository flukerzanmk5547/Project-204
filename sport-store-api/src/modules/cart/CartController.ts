import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { CartService } from "./CartService.js";
import { CartSchema } from "./CartSchema.js";

interface AuthenticatedRequest extends FastifyRequest {
  user: { id: string };
}

export class CartController extends BaseController {
  private readonly service: CartService;

  constructor() {
    super();
    this.service = new CartService();
  }

  private getUserId(request: FastifyRequest): string {
    const user = (request as AuthenticatedRequest).user;
    if (!user?.id) {
      throw HttpException.unauthorized();
    }
    return user.id;
  }

  public async getCart(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = this.getUserId(request);
    const cart = await this.service.getCart(userId);
    this.sendSuccess(reply, cart);
  }

  public async addItem(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = this.getUserId(request);
    const parsed = CartSchema.addItem.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const items = await this.service.addItem(userId, parsed.data);
    this.sendSuccess(reply, items);
  }

  public async updateItem(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = this.getUserId(request);
    const { id } = CartSchema.params.parse(
      request.params as Record<string, string>
    );
    const parsed = CartSchema.updateItem.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const items = await this.service.updateItem(userId, id, parsed.data);
    this.sendSuccess(reply, items);
  }

  public async removeItem(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = this.getUserId(request);
    const { id } = CartSchema.params.parse(
      request.params as Record<string, string>
    );

    const items = await this.service.removeItem(userId, id);
    this.sendSuccess(reply, items);
  }

  public async clearCart(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = this.getUserId(request);
    await this.service.clearCart(userId);
    this.sendNoContent(reply);
  }

  public async getCount(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = this.getUserId(request);
    const count = await this.service.getItemCount(userId);
    this.sendSuccess(reply, { count });
  }
}
