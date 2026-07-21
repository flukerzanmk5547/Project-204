import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { AnalyticsService } from "./AnalyticsService.js";

export class AnalyticsController extends BaseController {
  private readonly service: AnalyticsService;

  constructor() {
    super();
    this.service = new AnalyticsService();
  }

  public async getFull(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const data = await this.service.getFullAnalytics();
    this.sendSuccess(reply, data);
  }

  public async getFavorites(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const data = await this.service.getFavoriteAnalytics();
    this.sendSuccess(reply, data);
  }

  public async getViews(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const data = await this.service.getViewAnalytics();
    this.sendSuccess(reply, data);
  }

  public async getPurchases(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const data = await this.service.getPurchaseAnalytics();
    this.sendSuccess(reply, data);
  }
}
