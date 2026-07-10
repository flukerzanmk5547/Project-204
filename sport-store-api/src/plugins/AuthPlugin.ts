import type { FastifyRequest, FastifyReply } from "fastify";
import { Database } from "../config/Database.js";
import { HttpException } from "../shared/HttpException.js";

export class AuthPlugin {
  public static async authenticate(
    request: FastifyRequest,
    _reply: FastifyReply
  ): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw HttpException.unauthorized("กรุณาระบุ Token");
    }

    const token = authHeader.substring(7);
    const db = Database.getInstance().getClient();

    const {
      data: { user },
      error,
    } = await db.auth.getUser(token);

    if (error || !user) {
      throw HttpException.unauthorized("Token ไม่ถูกต้องหรือหมดอายุ");
    }

    (request as FastifyRequest & { user: typeof user }).user = user;
  }

  public static optionalAuth(
    request: FastifyRequest,
    _reply: FastifyReply
  ): void {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return;
    }

    const token = authHeader.substring(7);
    const db = Database.getInstance().getClient();

    db.auth.getUser(token).then(({ data: { user } }) => {
      if (user) {
        (request as FastifyRequest & { user: typeof user }).user = user;
      }
    });
  }
}
