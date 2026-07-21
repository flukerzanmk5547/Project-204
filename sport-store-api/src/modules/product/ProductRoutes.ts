import type { FastifyInstance } from "fastify";
import { ProductController } from "./ProductController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class ProductRoutes {
  private readonly controller: ProductController;

  constructor() {
    this.controller = new ProductController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // Public routes
        router.get("/", this.controller.getAll.bind(this.controller));
        router.get("/:id", this.controller.getById.bind(this.controller));
        router.get(
          "/:id/related",
          this.controller.getRelated.bind(this.controller)
        );

        // Reseller+ routes
        const reseller = AuthPlugin.requireRole("reseller");
        router.post("/", { preHandler: [reseller] }, this.controller.create.bind(this.controller));
        router.put("/:id", { preHandler: [reseller] }, this.controller.update.bind(this.controller));
        router.delete("/:id", { preHandler: [reseller] }, this.controller.delete.bind(this.controller));
      },
      { prefix: "/api/v1/products" }
    );
  }
}
