import Fastify, { type FastifyInstance } from "fastify";
import { Environment } from "./Environment.js";

export class Server {
  private readonly app: FastifyInstance;
  private readonly env: Environment;

  constructor() {
    this.env = Environment.getInstance();
    this.app = Fastify({
      logger: {
        level: this.env.isDevelopment ? "info" : "warn",
        transport: this.env.isDevelopment
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
      },
    });
  }

  public getApp(): FastifyInstance {
    return this.app;
  }

  public async start(): Promise<void> {
    try {
      await this.app.listen({
        port: this.env.port,
        host: this.env.host,
      });
      console.log(
        `🚀 Server running at http://${this.env.host}:${this.env.port}`
      );
    } catch (error) {
      this.app.log.error(error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    await this.app.close();
  }
}
