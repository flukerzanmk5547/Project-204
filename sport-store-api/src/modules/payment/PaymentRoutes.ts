import type { FastifyInstance } from "fastify";
import { PaymentController } from "./PaymentController.js";
import { PaymentAccountController } from "./PaymentAccountController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class PaymentRoutes {
  private readonly controller: PaymentController;
  private readonly accountController: PaymentAccountController;

  constructor() {
    this.controller = new PaymentController();
    this.accountController = new PaymentAccountController();
  }

  public register(app: FastifyInstance): void {
    // Payment endpoints
    app.register(
      async (router) => {
        router.post("/", {
          preHandler: AuthPlugin.optionalAuth,
          handler: this.controller.create.bind(this.controller),
        });

        router.get(
          "/:id/status",
          this.controller.checkStatus.bind(this.controller)
        );

        router.get(
          "/order/:orderId",
          this.controller.getByOrder.bind(this.controller)
        );

        router.get(
          "/bot/status",
          this.controller.getBotStatus.bind(this.controller)
        );

        router.post("/:id/confirm", {
          preHandler: AuthPlugin.requireRole("reseller"),
          handler: this.controller.manualConfirm.bind(this.controller),
        });
      },
      { prefix: "/api/v1/payments" }
    );

    // Manager: Payment Account Management
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.requireRole("manager"));

        router.get(
          "/",
          this.accountController.getAll.bind(this.accountController)
        );
        router.get(
          "/:id",
          this.accountController.getById.bind(this.accountController)
        );
        router.post(
          "/",
          this.accountController.create.bind(this.accountController)
        );
        router.put(
          "/:id",
          this.accountController.update.bind(this.accountController)
        );
        router.delete(
          "/:id",
          this.accountController.remove.bind(this.accountController)
        );

        // Supported banks list
        router.get(
          "/banks/supported",
          this.accountController.supportedBanks.bind(this.accountController)
        );

        // Bank chats
        router.post(
          "/:id/banks",
          this.accountController.addBankChat.bind(this.accountController)
        );
        router.delete(
          "/banks/:chatId",
          this.accountController.removeBankChat.bind(this.accountController)
        );

        // LINE connection
        router.post(
          "/:id/line/login",
          this.accountController.lineLogin.bind(this.accountController)
        );
        router.get(
          "/:id/line/status",
          this.accountController.lineStatus.bind(this.accountController)
        );
        router.post(
          "/:id/line/disconnect",
          this.accountController.lineDisconnect.bind(this.accountController)
        );
      },
      { prefix: "/api/v1/payment-accounts" }
    );
  }
}
