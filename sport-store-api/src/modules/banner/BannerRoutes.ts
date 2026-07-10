import type { FastifyInstance } from "fastify";
import { BannerController } from "./BannerController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class BannerRoutes {
  private readonly controller: BannerController;

  constructor() {
    this.controller = new BannerController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        router.get("/", this.controller.getAll.bind(this.controller));
        router.get("/:id", this.controller.getById.bind(this.controller));

        router.post("/", { preHandler: [AuthPlugin.authenticate] }, this.controller.create.bind(this.controller));
        router.put("/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.update.bind(this.controller));
        router.delete("/:id", { preHandler: [AuthPlugin.authenticate] }, this.controller.delete.bind(this.controller));
      },
      { prefix: "/api/v1/banners" }
    );
  }
}
