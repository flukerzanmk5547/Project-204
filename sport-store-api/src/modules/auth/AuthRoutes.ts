import type { FastifyInstance } from "fastify";
import { AuthController } from "./AuthController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class AuthRoutes {
  private readonly controller: AuthController;

  constructor() {
    this.controller = new AuthController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // Public routes
        router.post(
          "/register",
          this.controller.register.bind(this.controller)
        );
        router.post("/login", this.controller.login.bind(this.controller));
        router.post(
          "/reset-password",
          this.controller.resetPassword.bind(this.controller)
        );
        router.post(
          "/refresh",
          this.controller.refreshToken.bind(this.controller)
        );

        // Protected routes
        router.post(
          "/logout",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.logout.bind(this.controller)
        );
        router.get(
          "/profile",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.getProfile.bind(this.controller)
        );
        router.patch(
          "/profile",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.updateProfile.bind(this.controller)
        );
        router.patch(
          "/profile/password",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.changePassword.bind(this.controller)
        );
        router.patch(
          "/profile/email",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.changeEmail.bind(this.controller)
        );

        // Manager-only routes
        const manager = AuthPlugin.requireRole("manager");
        router.get(
          "/users",
          { preHandler: [manager] },
          this.controller.listUsers.bind(this.controller)
        );
        router.patch(
          "/users/:id/role",
          { preHandler: [manager] },
          this.controller.changeRole.bind(this.controller)
        );
      },
      { prefix: "/api/v1/auth" }
    );
  }
}
