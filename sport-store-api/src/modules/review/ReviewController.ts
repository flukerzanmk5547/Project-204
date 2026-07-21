import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { ReviewService } from "./ReviewService.js";
import { ReviewSchema } from "./ReviewSchema.js";

interface AuthRequest extends FastifyRequest {
  user: { id: string; user_metadata?: { full_name?: string } };
}

export class ReviewController extends BaseController {
  private readonly service: ReviewService;

  constructor() {
    super();
    this.service = new ReviewService();
  }

  public async getByProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { productId } = request.params as { productId: string };
    const { page, limit } = request.query as { page?: string; limit?: string };
    const result = await this.service.getByProduct(
      productId,
      Number(page) || 1,
      Number(limit) || 20
    );
    this.sendSuccess(reply, result);
  }

  public async getMyReview(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { productId } = request.params as { productId: string };
    const review = await this.service.getMyReview(userId, productId);
    this.sendSuccess(reply, review);
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const authUser = (request as AuthRequest).user;
    const parsed = ReviewSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const review = await this.service.create(
      authUser.id,
      authUser.user_metadata?.full_name ?? null,
      parsed.data
    );
    this.sendCreated(reply, review);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { id } = request.params as { id: string };
    const parsed = ReviewSchema.update.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const review = await this.service.update(userId, id, parsed.data);
    this.sendSuccess(reply, review);
  }

  public async remove(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { id } = request.params as { id: string };
    await this.service.remove(userId, id);
    this.sendMessage(reply, "ลบรีวิวสำเร็จ");
  }
}
