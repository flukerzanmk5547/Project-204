import type { FastifyInstance } from "fastify";
import { CategoryController } from "./CategoryController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class CategoryRoutes {
  private readonly controller: CategoryController;

  constructor() {
    this.controller = new CategoryController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        router.get("/tree", this.controller.getTree.bind(this.controller));
        router.get("/roots", this.controller.getRoots.bind(this.controller));
        router.get("/route/*", this.controller.getByRoute.bind(this.controller));
        router.get("/:id", this.controller.getById.bind(this.controller));
        router.get(
          "/:id/children",
          this.controller.getChildren.bind(this.controller)
        );

        router.post(
          "/",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.create.bind(this.controller)
        );
        router.put(
          "/:id",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.update.bind(this.controller)
        );
        router.delete(
          "/:id",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.delete.bind(this.controller)
        );
      },
      { prefix: "/api/v1/categories" }
    );
  }
}
