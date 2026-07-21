import type { FastifyInstance } from "fastify";
import { OrderController } from "./OrderController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class OrderRoutes {
  private readonly controller: OrderController;

  constructor() {
    this.controller = new OrderController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // Guest checkout — ไม่ต้อง login, auth เป็น optional
        router.post("/", {
          preHandler: AuthPlugin.optionalAuth,
          handler: this.controller.create.bind(this.controller),
        });

        // Authenticated routes
        router.register(async (authRouter) => {
          authRouter.addHook("preHandler", AuthPlugin.authenticate);

          authRouter.get(
            "/history",
            this.controller.getHistory.bind(this.controller)
          );
          authRouter.get(
            "/:id",
            this.controller.getDetail.bind(this.controller)
          );
        });

        // Reseller+: update order status
        router.patch("/:id/status", {
          preHandler: AuthPlugin.requireRole("reseller"),
          handler: this.controller.updateStatus.bind(this.controller),
        });
      },
      { prefix: "/api/v1/orders" }
    );
  }
}
