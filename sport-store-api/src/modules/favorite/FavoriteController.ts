import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { FavoriteService } from "./FavoriteService.js";
import { FavoriteSchema } from "./FavoriteSchema.js";

interface AuthRequest extends FastifyRequest {
  user: { id: string };
}

export class FavoriteController extends BaseController {
  private readonly service: FavoriteService;

  constructor() {
    super();
    this.service = new FavoriteService();
  }

  public async getMyFavorites(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { page, limit } = request.query as {
      page?: string;
      limit?: string;
    };
    const result = await this.service.getMyFavorites(
      userId,
      Number(page) || 1,
      Number(limit) || 50
    );
    this.sendSuccess(reply, result);
  }

  public async getMyFavoriteIds(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const ids = await this.service.getMyFavoriteIds(userId);
    this.sendSuccess(reply, ids);
  }

  public async toggle(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const parsed = FavoriteSchema.toggle.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const result = await this.service.toggle(userId, parsed.data.product_id);
    this.sendSuccess(reply, result);
  }

  public async remove(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { productId } = request.params as { productId: string };
    await this.service.remove(userId, productId);
    this.sendMessage(reply, "ลบสินค้าโปรดสำเร็จ");
  }
}
