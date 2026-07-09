import type { FastifyInstance } from "fastify";
import { CartController } from "./CartController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class CartRoutes {
  private readonly controller: CartController;

  constructor() {
    this.controller = new CartController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // All cart routes require authentication
        router.addHook("preHandler", AuthPlugin.authenticate);

        router.get("/", this.controller.getCart.bind(this.controller));
        router.get("/count", this.controller.getCount.bind(this.controller));
        router.post("/items", this.controller.addItem.bind(this.controller));
        router.patch(
          "/items/:id",
          this.controller.updateItem.bind(this.controller)
        );
        router.delete(
          "/items/:id",
          this.controller.removeItem.bind(this.controller)
        );
        router.delete("/", this.controller.clearCart.bind(this.controller));
      },
      { prefix: "/api/v1/cart" }
    );
  }
}
