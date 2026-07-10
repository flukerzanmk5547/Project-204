import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { RecommendationService } from "./RecommendationService.js";

export class RecommendationController extends BaseController {
  private readonly service: RecommendationService;

  constructor() {
    super();
    this.service = new RecommendationService();
  }

  /**
   * POST /api/v1/recommendations/view
   * Track product view — เรียกทุกครั้งที่ user เปิดดูสินค้า
   */
  public async trackView(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { product_id, session_id } = request.body as {
      product_id: string;
      session_id?: string;
    };

    if (!product_id) throw HttpException.badRequest("กรุณาระบุ product_id");

    const userId = (request as unknown as Record<string, unknown>).userId as string | undefined;
    await this.service.trackView(product_id, userId, session_id);
    this.sendMessage(reply, "tracked", 201);
  }

  /**
   * GET /api/v1/recommendations/product/:id
   * "ท่านอาจจะชอบสิ่งนี้" — recommendations for a specific product
   */
  public async getForProduct(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const { limit, session_id } = request.query as { limit?: string; session_id?: string };

    const userId = (request as unknown as Record<string, unknown>).userId as string | undefined;
    const recommendations = await this.service.getRecommendations(
      id,
      userId,
      session_id,
      limit ? parseInt(limit) : 8
    );

    this.sendSuccess(reply, recommendations);
  }

  /**
   * GET /api/v1/recommendations/trending
   * สินค้ามาแรง — sorted by views ใน N วันที่ผ่านมา
   */
  public async getTrending(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { days, limit } = request.query as { days?: string; limit?: string };

    const products = await this.service.getTrending(
      days ? parseInt(days) : 7,
      limit ? parseInt(limit) : 12
    );

    this.sendSuccess(reply, products);
  }
}
