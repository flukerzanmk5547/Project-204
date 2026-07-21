import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { FeedbackService } from "./FeedbackService.js";
import { FeedbackSchema } from "./FeedbackSchema.js";

interface MaybeAuthRequest extends FastifyRequest {
  user?: { id: string };
}

export class FeedbackController extends BaseController {
  private readonly service: FeedbackService;

  constructor() {
    super();
    this.service = new FeedbackService();
  }

  /** ส่งแบบประเมิน — ผู้ใช้ทั่วไปที่ยังไม่ล็อกอินก็ส่งได้ */
  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = FeedbackSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const userId = (request as MaybeAuthRequest).user?.id ?? null;
    const feedback = await this.service.create(userId, parsed.data);
    this.sendCreated(reply, feedback);
  }

  public async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { page, limit } = request.query as { page?: string; limit?: string };
    const result = await this.service.getAll(
      Number(page) || 1,
      Number(limit) || 50
    );
    this.sendSuccess(reply, result);
  }

  public async getSummary(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const summary = await this.service.getSummary();
    this.sendSuccess(reply, summary);
  }
}
