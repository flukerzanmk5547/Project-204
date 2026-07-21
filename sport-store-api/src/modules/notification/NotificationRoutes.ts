import type { FastifyInstance } from "fastify";
import { NotificationController } from "./NotificationController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class NotificationRoutes {
  private readonly controller: NotificationController;

  constructor() {
    this.controller = new NotificationController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // reseller ขึ้นไป (รวม manager) ถึงจะเห็นการแจ้งเตือนหลังบ้าน
        const staff = { preHandler: [AuthPlugin.requireRole("reseller")] };
        const c = this.controller;

        router.get("/", staff, c.getAll.bind(c));
        router.get("/unread-count", staff, c.getUnreadCount.bind(c));
        router.patch("/:id/read", staff, c.markRead.bind(c));
        router.post("/read-all", staff, c.markAllRead.bind(c));
      },
      { prefix: "/api/v1/notifications" }
    );
  }
}
