import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { AuthService } from "./AuthService.js";
import { AuthSchema } from "./AuthSchema.js";

interface AuthenticatedRequest extends FastifyRequest {
  user: { id: string };
}

export class AuthController extends BaseController {
  private readonly service: AuthService;

  constructor() {
    super();
    this.service = new AuthService();
  }

  public async register(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = AuthSchema.register.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const result = await this.service.register(parsed.data);
    this.sendCreated(reply, result);
  }

  public async login(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = AuthSchema.login.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const result = await this.service.login(parsed.data);
    this.sendSuccess(reply, result);
  }

  public async logout(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      await this.service.logout(authHeader.substring(7));
    }
    this.sendMessage(reply, "ออกจากระบบสำเร็จ");
  }

  public async getProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthenticatedRequest).user.id;
    const profile = await this.service.getProfile(userId);
    this.sendSuccess(reply, profile);
  }

  public async updateProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthenticatedRequest).user.id;
    const parsed = AuthSchema.updateProfile.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const profile = await this.service.updateProfile(userId, parsed.data);
    this.sendSuccess(reply, profile);
  }

  public async resetPassword(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = AuthSchema.resetPassword.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    await this.service.requestPasswordReset(parsed.data.email);
    this.sendMessage(reply, "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว");
  }

  public async refreshToken(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { refresh_token } = request.body as { refresh_token: string };
    if (!refresh_token) {
      throw HttpException.badRequest("กรุณาระบุ refresh token");
    }

    const tokens = await this.service.refreshToken(refresh_token);
    this.sendSuccess(reply, tokens);
  }
}
