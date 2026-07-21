import type { FastifyInstance } from "fastify";
import { FeedbackController } from "./FeedbackController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class FeedbackRoutes {
  private readonly controller: FeedbackController;

  constructor() {
    this.controller = new FeedbackController();
  }

  public register(app: FastifyInstance): void {
    // ส่งแบบประเมิน — ไม่บังคับล็อกอิน (แนบ user ให้ถ้ามี token)
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.optionalAuth);
        router.post("/", this.controller.create.bind(this.controller));
      },
      { prefix: "/api/v1/feedbacks" }
    );

    // ดูผลประเมิน — เฉพาะ reseller ขึ้นไป
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.requireRole("reseller"));
        router.get("/", this.controller.getAll.bind(this.controller));
        router.get(
          "/summary",
          this.controller.getSummary.bind(this.controller)
        );
      },
      { prefix: "/api/v1/feedbacks" }
    );
  }
}
