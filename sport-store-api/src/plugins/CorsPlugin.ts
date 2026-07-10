import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { Environment } from "../config/Environment.js";

export class CorsPlugin {
  public static async register(app: FastifyInstance): Promise<void> {
    const env = Environment.getInstance();

    await app.register(cors, {
      origin: env.corsOrigin.split(","),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
  }
}
