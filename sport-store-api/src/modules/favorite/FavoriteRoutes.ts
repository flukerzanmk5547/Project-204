import type { FastifyInstance } from "fastify";
import { FavoriteController } from "./FavoriteController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class FavoriteRoutes {
  private readonly controller: FavoriteController;

  constructor() {
    this.controller = new FavoriteController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.authenticate);

        router.get(
          "/",
          this.controller.getMyFavorites.bind(this.controller)
        );
        router.get(
          "/ids",
          this.controller.getMyFavoriteIds.bind(this.controller)
        );
        router.post(
          "/toggle",
          this.controller.toggle.bind(this.controller)
        );
        router.delete(
          "/:productId",
          this.controller.remove.bind(this.controller)
        );
      },
      { prefix: "/api/v1/favorites" }
    );
  }
}
