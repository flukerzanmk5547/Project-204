import type { FastifyInstance } from "fastify";
import { Server } from "./config/Server.js";
import { Database } from "./config/Database.js";
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
  }

  public async start(): Promise<void> {
    await this.registerPlugins();
    this.registerRoutes();
    await this.server.start();
  }

  public async stop(): Promise<void> {
    await this.server.stop();
  }
}
