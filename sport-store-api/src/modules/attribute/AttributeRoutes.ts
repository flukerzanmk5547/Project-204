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
        // Attribute Groups
        router.get("/groups", this.controller.getAllGroups.bind(this.controller));
        router.get("/groups/:id", this.controller.getGroupById.bind(this.controller));
        router.get("/groups/:id/options", this.controller.getOptions.bind(this.controller));
        router.post("/groups", { preHandler: [AuthPlugin.authenticate] }, this.controller.createGroup.bind(this.controller));
        router.put("/groups/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.updateGroup.bind(this.controller));
        router.delete("/groups/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.deleteGroup.bind(this.controller));

        // Attribute Options
        router.post("/options", { preHandler: [AuthPlugin.authenticate] }, this.controller.createOption.bind(this.controller));
        router.put("/options/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.updateOption.bind(this.controller));
        router.delete("/options/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.deleteOption.bind(this.controller));

        // Category ↔ Attribute Groups
        router.get("/categories/:id", this.controller.getCategoryAttributes.bind(this.controller));
        router.post("/categories/link", { preHandler: [AuthPlugin.authenticate] }, this.controller.linkCategoryAttribute.bind(this.controller));
        router.delete("/categories/unlink", { preHandler: [AuthPlugin.authenticate] }, this.controller.unlinkCategoryAttribute.bind(this.controller));

        // Product Variants
        router.get("/variants/product/:id", this.controller.getVariants.bind(this.controller));
        router.post("/variants", { preHandler: [AuthPlugin.authenticate] }, this.controller.createVariant.bind(this.controller));
        router.put("/variants/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.updateVariant.bind(this.controller));
        router.delete("/variants/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.deleteVariant.bind(this.controller));
      },
      { prefix: "/api/v1/attributes" }
    );
  }
}
