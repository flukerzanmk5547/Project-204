import type { FastifyInstance } from "fastify";
import { Server } from "./config/Server.js";
import { Database } from "./config/Database.js";
import { Environment } from "./config/Environment.js";
import { CorsPlugin } from "./plugins/CorsPlugin.js";
import { ErrorHandler } from "./plugins/ErrorHandler.js";
import { ProductRoutes } from "./modules/product/ProductRoutes.js";
import { CategoryRoutes } from "./modules/category/CategoryRoutes.js";
import { CartRoutes } from "./modules/cart/CartRoutes.js";
import { AuthRoutes } from "./modules/auth/AuthRoutes.js";
import { BannerRoutes } from "./modules/banner/BannerRoutes.js";
import { HomepageRoutes } from "./modules/homepage/HomepageRoutes.js";
import { AttributeRoutes } from "./modules/attribute/AttributeRoutes.js";
import { PromotionRoutes } from "./modules/promotion/PromotionRoutes.js";
import { RecommendationRoutes } from "./modules/recommendation/RecommendationRoutes.js";
import { BundleRoutes } from "./modules/bundle/BundleRoutes.js";
import { AddressRoutes } from "./modules/address/AddressRoutes.js";
import { OrderRoutes } from "./modules/order/OrderRoutes.js";
import { PaymentRoutes } from "./modules/payment/PaymentRoutes.js";
import { NotificationRoutes } from "./modules/notification/NotificationRoutes.js";
import { DashboardRoutes } from "./modules/dashboard/DashboardRoutes.js";
import { SuperAdminRoutes } from "./modules/superadmin/SuperAdminRoutes.js";
import { FavoriteRoutes } from "./modules/favorite/FavoriteRoutes.js";
import { AnalyticsRoutes } from "./modules/analytics/AnalyticsRoutes.js";
import { getLineBotInstance } from "./modules/payment/LineBotService.js";

export class Application {
  private readonly server: Server;
  private readonly app: FastifyInstance;

  constructor() {
    this.server = new Server();
    this.app = this.server.getApp();
  }

  private async registerPlugins(): Promise<void> {
    await CorsPlugin.register(this.app);
    ErrorHandler.register(this.app);

    const env = Environment.getInstance();
    if (env.isUAT) {
      this.registerUATHooks();
    }
  }

  private registerUATHooks(): void {
    this.app.addHook("onRequest", async (request, _reply) => {
      const body = request.body
        ? JSON.stringify(request.body).substring(0, 500)
        : "-";
      console.log(
        `[UAT] → ${request.method} ${request.url} body=${body}`
      );
    });

    this.app.addHook("onSend", async (_request, reply, payload) => {
      reply.header("X-Environment", "uat");
      return payload;
    });

    console.log("[UAT] Verbose logging and X-Environment header enabled");
  }

  private registerRoutes(): void {
    // Health check
    this.app.get("/api/health", async (_request, reply) => {
      const dbHealthy = await Database.getInstance().healthCheck();
      const status = dbHealthy ? 200 : 503;

      reply.status(status).send({
        success: dbHealthy,
        data: {
          status: dbHealthy ? "healthy" : "unhealthy",
          timestamp: new Date().toISOString(),
          database: dbHealthy ? "connected" : "disconnected",
        },
      });
    });

    // Module routes
    new ProductRoutes().register(this.app);
    new CategoryRoutes().register(this.app);
    new CartRoutes().register(this.app);
    new AuthRoutes().register(this.app);
    new BannerRoutes().register(this.app);
    new HomepageRoutes().register(this.app);
    new AttributeRoutes().register(this.app);
    new PromotionRoutes().register(this.app);
    new RecommendationRoutes().register(this.app);
    new BundleRoutes().register(this.app);
    new AddressRoutes().register(this.app);
    new OrderRoutes().register(this.app);
    new PaymentRoutes().register(this.app);
    new NotificationRoutes().register(this.app);
    new DashboardRoutes().register(this.app);
    new SuperAdminRoutes().register(this.app);
    new FavoriteRoutes().register(this.app);
    new AnalyticsRoutes().register(this.app);
  }

  public async start(): Promise<void> {
    await this.registerPlugins();
    this.registerRoutes();
    await this.server.start();

    const env = Environment.getInstance();
    if (env.isUAT) {
      console.log("╔══════════════════════════════════════════╗");
      console.log("║          UAT MODE ACTIVE                 ║");
      console.log(`║  Payment fixed: ฿${env.uatFixedAmount}                      ║`);
      console.log(`║  Auto-confirm: ${env.uatAutoConfirmPayment ? "ON (" + env.uatAutoConfirmDelayMs + "ms)" : "OFF"}            ║`);
      console.log(`║  Orders tagged: is_test=true             ║`);
      console.log("╚══════════════════════════════════════════╝");
    }

    const lineBot = getLineBotInstance();
    lineBot.autoStart().catch((err) => {
      console.error("[Application] LINE bot auto-start failed:", err);
    });
  }

  public async stop(): Promise<void> {
    await this.server.stop();
  }
}
