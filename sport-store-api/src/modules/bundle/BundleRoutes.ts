import type { FastifyInstance } from "fastify";
import { BundleController } from "./BundleController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class BundleRoutes {
  private readonly controller: BundleController;

  constructor() {
    this.controller = new BundleController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        const reseller = AuthPlugin.requireRole("reseller");

        // === Public ===
        router.get(
          "/active",
          this.controller.getActiveBundles.bind(this.controller)
        );

        router.get(
          "/product/:productId",
          this.controller.getBundlesForProduct.bind(this.controller)
        );

        router.get(
          "/:id",
          this.controller.getById.bind(this.controller)
        );

        // === Reseller+ ===
        router.get(
          "/",
          { preHandler: [reseller] },
          this.controller.getAll.bind(this.controller)
        );

        router.post(
          "/",
          { preHandler: [reseller] },
          this.controller.create.bind(this.controller)
        );

        router.put(
          "/:id",
          { preHandler: [reseller] },
          this.controller.update.bind(this.controller)
        );

        router.delete(
          "/:id",
          { preHandler: [reseller] },
          this.controller.remove.bind(this.controller)
        );

        // --- Bundle Items ---
        router.post(
          "/:id/items",
          { preHandler: [reseller] },
          this.controller.addItem.bind(this.controller)
        );

        router.post(
          "/:id/items/batch",
          { preHandler: [reseller] },
          this.controller.addItems.bind(this.controller)
        );

        router.delete(
          "/:id/items/:itemId",
          { preHandler: [reseller] },
          this.controller.removeItem.bind(this.controller)
        );

        // --- Product-Bundle Links ---
        router.post(
          "/:id/link",
          { preHandler: [reseller] },
          this.controller.linkToProduct.bind(this.controller)
        );

        router.delete(
          "/:id/link",
          { preHandler: [reseller] },
          this.controller.unlinkFromProduct.bind(this.controller)
        );
      },
      { prefix: "/api/v1/bundles" }
    );
  }
}
