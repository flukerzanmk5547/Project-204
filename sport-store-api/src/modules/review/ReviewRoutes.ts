import type { FastifyInstance } from "fastify";
import { ReviewController } from "./ReviewController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class ReviewRoutes {
  private readonly controller: ReviewController;

  constructor() {
    this.controller = new ReviewController();
  }

  public register(app: FastifyInstance): void {
    // อ่านรีวิวได้โดยไม่ต้องล็อกอิน
    app.register(
      async (router) => {
        router.get(
          "/product/:productId",
          this.controller.getByProduct.bind(this.controller)
        );
      },
      { prefix: "/api/v1/reviews" }
    );

    // เขียน / แก้ไข / ลบ ต้องล็อกอิน
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.authenticate);

        router.get(
          "/me/:productId",
          this.controller.getMyReview.bind(this.controller)
        );
        router.post("/", this.controller.create.bind(this.controller));
        router.put("/:id", this.controller.update.bind(this.controller));
        router.delete("/:id", this.controller.remove.bind(this.controller));
      },
      { prefix: "/api/v1/reviews" }
    );
  }
}
