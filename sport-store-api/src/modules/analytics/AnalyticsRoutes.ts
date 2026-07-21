import type { FastifyInstance } from "fastify";
import { AnalyticsController } from "./AnalyticsController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class AnalyticsRoutes {
  private readonly controller: AnalyticsController;

  constructor() {
    this.controller = new AnalyticsController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.requireRole("reseller"));

        router.get(
          "/",
          this.controller.getFull.bind(this.controller)
        );
        router.get(
          "/favorites",
          this.controller.getFavorites.bind(this.controller)
        );
        router.get(
          "/views",
          this.controller.getViews.bind(this.controller)
        );
        router.get(
          "/purchases",
          this.controller.getPurchases.bind(this.controller)
        );
      },
      { prefix: "/api/v1/analytics" }
    );
  }
}
