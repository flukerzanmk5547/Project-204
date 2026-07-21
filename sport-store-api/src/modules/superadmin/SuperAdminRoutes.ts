import type { FastifyInstance } from "fastify";
import { SuperAdminController } from "./SuperAdminController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class SuperAdminRoutes {
  private readonly controller: SuperAdminController;

  constructor() {
    this.controller = new SuperAdminController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.requireRole("superadmin"));

        // Staff management
        router.post(
          "/staff",
          this.controller.createStaff.bind(this.controller)
        );
        router.get(
          "/staff",
          this.controller.listStaff.bind(this.controller)
        );

        // All users
        router.get(
          "/users",
          this.controller.listAllUsers.bind(this.controller)
        );
        router.get(
          "/users/:id",
          this.controller.getUser.bind(this.controller)
        );
        router.patch(
          "/users/:id/role",
          this.controller.changeRole.bind(this.controller)
        );
        router.patch(
          "/users/:id/active",
          this.controller.toggleActive.bind(this.controller)
        );
        router.delete(
          "/users/:id",
          this.controller.deleteUser.bind(this.controller)
        );

        // System stats
        router.get(
          "/stats",
          this.controller.getStats.bind(this.controller)
        );
      },
      { prefix: "/api/v1/superadmin" }
    );
  }
}
