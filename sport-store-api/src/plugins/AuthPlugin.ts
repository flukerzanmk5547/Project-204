import type { FastifyRequest, FastifyReply } from "fastify";
import { Database } from "../config/Database.js";
import { HttpException } from "../shared/HttpException.js";

type Role = "customer" | "reseller" | "manager" | "superadmin";

const ROLE_LEVEL: Record<Role, number> = {
  customer: 0,
  reseller: 1,
  manager: 2,
  superadmin: 3,
};

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

  public static async optionalAuth(
    request: FastifyRequest,
    _reply: FastifyReply
  ): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return;
    }

    const token = authHeader.substring(7);
    const db = Database.getInstance().getClient();

    try {
      const {
        data: { user },
      } = await db.auth.getUser(token);
      if (user) {
        (request as FastifyRequest & { user: typeof user }).user = user;
      }
    } catch {
      /* token ไม่ valid — ข้ามไป ไม่ block */
    }
  }

  /**
   * Hierarchy-based role guard.
   * requireRole('reseller') → reseller + manager ผ่าน
   * requireRole('manager')  → manager เท่านั้น
   */
  public static requireRole(
    ...roles: Role[]
  ): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
    const minLevel = Math.min(...roles.map((r) => ROLE_LEVEL[r] ?? 99));

    return async (request: FastifyRequest, reply: FastifyReply) => {
      await AuthPlugin.authenticate(request, reply);

      const userId = (request as FastifyRequest & { user: { id: string } })
        .user.id;

      const db = Database.getInstance().getAdminClient();
      const { data } = await db
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      const userRole = (data?.role as Role) || "customer";
      const userLevel = ROLE_LEVEL[userRole] ?? 0;

      if (userLevel < minLevel) {
        throw HttpException.forbidden(
          `สิทธิ์ไม่เพียงพอ (ต้องการ: ${roles.join("/")})`
        );
      }

      // attach role ไว้ใน request ให้ handler ใช้ต่อได้
      (
        request as FastifyRequest & { userRole: string }
      ).userRole = userRole;
    };
  }
}
