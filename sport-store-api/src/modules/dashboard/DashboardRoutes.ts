import type { FastifyInstance } from "fastify";
import { DashboardController } from "./DashboardController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class DashboardRoutes {
  private readonly controller: DashboardController;

  constructor() {
    this.controller = new DashboardController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // reseller ขึ้นไป (รวม manager) ถึงจะดูสถิติหลังบ้านได้
        const staff = { preHandler: [AuthPlugin.requireRole("reseller")] };
        router.get(
          "/stats",
          staff,
          this.controller.getStats.bind(this.controller)
        );
      },
      { prefix: "/api/v1/dashboard" }
    );
  }
}
