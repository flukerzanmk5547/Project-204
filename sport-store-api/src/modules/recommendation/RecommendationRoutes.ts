import type { FastifyInstance } from "fastify";
import { RecommendationController } from "./RecommendationController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class RecommendationRoutes {
  private readonly controller: RecommendationController;

  constructor() {
    this.controller = new RecommendationController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // Public — track view (ไม่ต้อง login, ใช้ session_id แทน)
        router.post("/view", this.controller.trackView.bind(this.controller));

        // Public — recommendations for product
        router.get("/product/:id", this.controller.getForProduct.bind(this.controller));

        // Public — trending products
        router.get("/trending", this.controller.getTrending.bind(this.controller));
      },
      { prefix: "/api/v1/recommendations" }
    );
  }
}
