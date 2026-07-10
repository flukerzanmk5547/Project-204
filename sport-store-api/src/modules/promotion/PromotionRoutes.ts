import type { FastifyInstance } from "fastify";
import { PromotionController } from "./PromotionController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class PromotionRoutes {
  private readonly controller: PromotionController;

  constructor() {
    this.controller = new PromotionController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // Public
        router.get("/", this.controller.getAll.bind(this.controller));
        router.get("/deals", this.controller.getActiveDeals.bind(this.controller));
        router.get("/slug/:slug", this.controller.getBySlug.bind(this.controller));
        router.get("/:id", this.controller.getById.bind(this.controller));
        router.get("/:id/products", this.controller.getProducts.bind(this.controller));

        // Admin
        router.post("/", { preHandler: [AuthPlugin.authenticate] }, this.controller.create.bind(this.controller));
        router.put("/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.update.bind(this.controller));
        router.delete("/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.delete.bind(this.controller));

        // Promotion products
        router.post("/products", { preHandler: [AuthPlugin.authenticate] }, this.controller.addProduct.bind(this.controller));
        router.put("/products/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.updateProduct.bind(this.controller));
        router.delete("/products/:promotionId/:productId", { preHandler: [AuthPlugin.authenticate] }, this.controller.removeProduct.bind(this.controller));
      },
      { prefix: "/api/v1/promotions" }
    );
  }
}
