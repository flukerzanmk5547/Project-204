import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { DashboardService } from "./DashboardService.js";

export class DashboardController extends BaseController {
  private readonly service: DashboardService;

  constructor() {
    super();
    this.service = new DashboardService();
  }

  public async getStats(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const stats = await this.service.getStats();
    this.sendSuccess(reply, stats);
  }
}
