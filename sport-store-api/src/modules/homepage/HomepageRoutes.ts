import type { FastifyInstance } from "fastify";
import { HomepageController } from "./HomepageController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class HomepageRoutes {
  private readonly controller: HomepageController;

  constructor() {
    this.controller = new HomepageController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        const auth = { preHandler: [AuthPlugin.authenticate] };
        const c = this.controller;

        // === Public ===
        router.get("/sections", c.getSections.bind(c));
        router.get("/shortcuts", c.getShortcuts.bind(c));
        router.get("/config/:key", c.getConfig.bind(c));

        // === Admin: Sections ===
        router.get("/admin/sections", auth, c.getAllSections.bind(c));
        router.post("/admin/sections", auth, c.createSection.bind(c));
        router.put("/admin/sections/:id", auth, c.updateSection.bind(c));
        router.delete("/admin/sections/:id", auth, c.deleteSection.bind(c));

        // === Admin: Section ↔ Product mapping ===
        router.post(
          "/admin/sections/:id/products",
          auth,
          c.addProduct.bind(c)
        );
        router.post(
          "/admin/sections/:id/products/batch",
          auth,
          c.addProducts.bind(c)
        );
        router.delete(
          "/admin/sections/:id/products/:productId",
          auth,
          c.removeProduct.bind(c)
        );

        // === Admin: Sub Category Items ===
        router.post("/admin/sub-categories", auth, c.createSubCategory.bind(c));
        router.put(
          "/admin/sub-categories/:id",
          auth,
          c.updateSubCategory.bind(c)
        );
        router.delete(
          "/admin/sub-categories/:id",
          auth,
          c.deleteSubCategory.bind(c)
        );

        // === Admin: Category Shortcuts ===
        router.get("/admin/shortcuts", auth, c.getAllShortcuts.bind(c));
        router.post("/admin/shortcuts", auth, c.createShortcut.bind(c));
        router.put("/admin/shortcuts/:id", auth, c.updateShortcut.bind(c));
        router.delete("/admin/shortcuts/:id", auth, c.deleteShortcut.bind(c));

        // === Admin: Site Config ===
        router.put("/admin/config/:key", auth, c.updateConfig.bind(c));
        router.delete("/admin/config/:key", auth, c.deleteConfig.bind(c));
      },
      { prefix: "/api/v1/homepage" }
    );
  }
}
