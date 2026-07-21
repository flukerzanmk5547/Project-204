import type { FastifyInstance } from "fastify";
import { AttributeController } from "./AttributeController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class AttributeRoutes {
  private readonly controller: AttributeController;

  constructor() {
    this.controller = new AttributeController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        const reseller = AuthPlugin.requireRole("reseller");

        // Public reads
        router.get("/groups", this.controller.getAllGroups.bind(this.controller));
        router.get("/groups/:id", this.controller.getGroupById.bind(this.controller));
        router.get("/groups/:id/options", this.controller.getOptions.bind(this.controller));
        router.get("/categories/:id", this.controller.getCategoryAttributes.bind(this.controller));
        router.get("/variants/product/:id", this.controller.getVariants.bind(this.controller));

        // Reseller+ writes
        router.post("/groups", { preHandler: [reseller] }, this.controller.createGroup.bind(this.controller));
        router.put("/groups/:id", { preHandler: [reseller] }, this.controller.updateGroup.bind(this.controller));
        router.delete("/groups/:id", { preHandler: [reseller] }, this.controller.deleteGroup.bind(this.controller));

        router.post("/options", { preHandler: [reseller] }, this.controller.createOption.bind(this.controller));
        router.put("/options/:id", { preHandler: [reseller] }, this.controller.updateOption.bind(this.controller));
        router.delete("/options/:id", { preHandler: [reseller] }, this.controller.deleteOption.bind(this.controller));

        router.post("/categories/link", { preHandler: [reseller] }, this.controller.linkCategoryAttribute.bind(this.controller));
        router.delete("/categories/unlink", { preHandler: [reseller] }, this.controller.unlinkCategoryAttribute.bind(this.controller));

        router.post("/variants", { preHandler: [reseller] }, this.controller.createVariant.bind(this.controller));
        router.put("/variants/:id", { preHandler: [reseller] }, this.controller.updateVariant.bind(this.controller));
        router.delete("/variants/:id", { preHandler: [reseller] }, this.controller.deleteVariant.bind(this.controller));
      },
      { prefix: "/api/v1/attributes" }
    );
  }
}
