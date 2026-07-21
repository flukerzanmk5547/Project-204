import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { AuthService } from "../auth/AuthService.js";
import { AuthSchema } from "../auth/AuthSchema.js";

interface IdParams {
  id: string;
}

export class SuperAdminController extends BaseController {
  private readonly service: AuthService;

  constructor() {
    super();
    this.service = new AuthService();
  }

  public async createStaff(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = AuthSchema.createStaff.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const result = await this.service.createStaff(parsed.data);
    this.sendCreated(reply, result);
  }

  public async listStaff(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { page, limit } = request.query as {
      page?: string;
      limit?: string;
    };
    const result = await this.service.listStaff(
      Number(page) || 1,
      Number(limit) || 50
    );
    this.sendSuccess(reply, result);
  }

  public async listAllUsers(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { page, limit, role } = request.query as {
      page?: string;
      limit?: string;
      role?: string;
    };
    const result = await this.service.listUsers(
      Number(page) || 1,
      Number(limit) || 50
    );

    if (role) {
      result.users = result.users.filter((u) => u.role === role);
      result.total = result.users.length;
    }

    this.sendSuccess(reply, result);
  }

  public async getUser(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as IdParams;
    const profile = await this.service.getProfile(id);
    this.sendSuccess(reply, profile);
  }

  public async changeRole(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as IdParams;
    const parsed = AuthSchema.changeRole.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const callerRole = (request as FastifyRequest & { userRole: string })
      .userRole;

    if (parsed.data.role === "superadmin" && callerRole !== "superadmin") {
      throw HttpException.forbidden(
        "เฉพาะ superadmin เท่านั้นที่สามารถแต่งตั้ง superadmin ได้"
      );
    }

    const updated = await this.service.changeUserRole(id, parsed.data.role);
    this.sendSuccess(reply, updated);
  }

  public async toggleActive(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as IdParams;
    const { active } = request.body as { active: boolean };

    if (typeof active !== "boolean") {
      throw HttpException.badRequest("กรุณาระบุ active (true/false)");
    }

    const result = await this.service.toggleUserActive(id, active);
    this.sendSuccess(reply, {
      ...result,
      is_active: active,
    });
  }

  public async deleteUser(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as IdParams;
    await this.service.deleteUser(id);
    this.sendMessage(reply, "ลบผู้ใช้สำเร็จ");
  }

  public async getStats(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const stats = await this.service.getSystemStats();
    this.sendSuccess(reply, stats);
  }
}
