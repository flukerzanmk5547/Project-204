import { Database } from "../../config/Database.js";
import { HttpException } from "../../shared/HttpException.js";
import { AuthRepository } from "./AuthRepository.js";
import type {
  RegisterDto,
  LoginDto,
  AuthTokens,
  UserProfile,
  UpdateProfileDto,
} from "./AuthSchema.js";

export class AuthService {
  private readonly repository: AuthRepository;
  private readonly db = Database.getInstance().getClient();

  constructor() {
    this.repository = new AuthRepository();
  }

  public async register(dto: RegisterDto): Promise<AuthTokens> {
    const { data, error } = await this.db.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          full_name: dto.full_name,
          phone: dto.phone,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        throw HttpException.conflict("อีเมลนี้ถูกลงทะเบียนแล้ว");
      }
      throw HttpException.badRequest(error.message);
    }

    if (!data.user || !data.session) {
      throw HttpException.internal("ไม่สามารถสร้างบัญชีได้");
    }

    const profile = await this.repository.upsertProfile({
      id: data.user.id,
      email: dto.email,
      full_name: dto.full_name,
      phone: dto.phone ?? null,
    });

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in ?? 3600,
      user: profile,
    };
  }

  public async login(dto: LoginDto): Promise<AuthTokens> {
    const { data, error } = await this.db.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw HttpException.unauthorized("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }

    const profile = await this.repository.findById(data.user.id);
    if (!profile) {
      throw HttpException.notFound("ไม่พบโปรไฟล์ผู้ใช้");
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in ?? 3600,
      user: profile,
    };
  }

  public async logout(token: string): Promise<void> {
    const { error } = await this.db.auth.admin.signOut(token);
    if (error) {
      throw HttpException.internal("ไม่สามารถออกจากระบบได้");
    }
  }

  public async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.repository.findById(userId);
    if (!profile) {
      throw HttpException.notFound("ไม่พบโปรไฟล์ผู้ใช้");
    }
    return profile;
  }

  public async updateProfile(
    userId: string,
    dto: UpdateProfileDto
  ): Promise<UserProfile> {
    return this.repository.update(userId, dto as Partial<UserProfile>);
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const { error } = await this.db.auth.resetPasswordForEmail(email);
    if (error) {
      throw HttpException.badRequest(error.message);
    }
  }

  public async refreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { data, error } = await this.db.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw HttpException.unauthorized("Refresh token ไม่ถูกต้อง");
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }
}
