import { Database } from "../../config/Database.js";
import { Environment } from "../../config/Environment.js";
import { HttpException } from "../../shared/HttpException.js";
import { AuthRepository } from "./AuthRepository.js";
import type {
  RegisterDto,
  LoginDto,
  AuthTokens,
  UserProfile,
  UpdateProfileDto,
  CreateStaffDto,
} from "./AuthSchema.js";

export class AuthService {
  private readonly repository: AuthRepository;
  private readonly db = Database.getInstance().getClient();
  private readonly env = Environment.getInstance();

  constructor() {
    this.repository = new AuthRepository();
  }

  /**
   * สร้าง user ผ่าน Supabase Admin REST API โดยตรง
   * (supabase-js client ไม่รองรับ sb_secret_* key format สำหรับ admin)
   */
  private async adminCreateUser(
    email: string,
    password: string,
    metadata: Record<string, unknown>
  ): Promise<{ id: string }> {
    const res = await fetch(
      `${this.env.supabaseUrl}/auth/v1/admin/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: this.env.supabaseServiceKey,
          Authorization: `Bearer ${this.env.supabaseServiceKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: metadata,
        }),
      }
    );

    const body = await res.json();

    if (!res.ok) {
      const msg =
        typeof body === "object" && body !== null
          ? (body as Record<string, string>).msg ||
            (body as Record<string, string>).message ||
            (body as Record<string, string>).error_description ||
            ""
          : "";
      if (
        msg.includes("already") ||
        msg.includes("exists") ||
        msg.includes("duplicate") ||
        res.status === 422
      ) {
        throw HttpException.conflict("อีเมลนี้ถูกลงทะเบียนแล้ว");
      }
      throw HttpException.badRequest(
        msg || "ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่"
      );
    }

    return { id: (body as { id: string }).id };
  }

  public async register(dto: RegisterDto): Promise<AuthTokens> {
    const created = await this.adminCreateUser(dto.email, dto.password, {
      full_name: dto.full_name,
      phone: dto.phone,
    });

    // Login ทันทีหลังสร้าง user (trigger handle_new_user สร้าง profile ให้แล้ว)
    const { data: loginData, error: loginError } =
      await this.db.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (loginError || !loginData.session) {
      throw HttpException.internal(
        "สร้างบัญชีสำเร็จแต่ไม่สามารถ login ได้ กรุณาเข้าสู่ระบบด้วยตนเอง"
      );
    }

    // อ่าน profile ที่ trigger สร้างไว้ ถ้ายังไม่มีก็สร้างใหม่
    let profile = await this.repository.findById(created.id);
    if (!profile) {
      profile = await this.repository.upsertProfile({
        id: created.id,
        email: dto.email,
        full_name: dto.full_name,
        phone: dto.phone ?? null,
      });
    }

    return {
      access_token: loginData.session.access_token,
      refresh_token: loginData.session.refresh_token,
      expires_in: loginData.session.expires_in ?? 3600,
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

  /**
   * เปลี่ยนรหัสผ่าน — ยืนยันรหัสผ่านปัจจุบันก่อน แล้วอัปเดตผ่าน Admin API
   */
  public async changePassword(
    userId: string,
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // ยืนยันรหัสผ่านปัจจุบัน
    const { error: verifyError } = await this.db.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (verifyError) {
      throw HttpException.badRequest("รหัสผ่านปัจจุบันไม่ถูกต้อง");
    }

    const res = await fetch(
      `${this.env.supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: this.env.supabaseServiceKey,
          Authorization: `Bearer ${this.env.supabaseServiceKey}`,
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    if (!res.ok) {
      throw HttpException.internal("ไม่สามารถเปลี่ยนรหัสผ่านได้");
    }
  }

  /**
   * เปลี่ยนอีเมล — ยืนยันรหัสผ่านก่อน แล้วอัปเดตทั้ง auth.users และ profiles
   */
  public async changeEmail(
    userId: string,
    currentEmail: string,
    newEmail: string,
    password: string
  ): Promise<UserProfile> {
    const { error: verifyError } = await this.db.auth.signInWithPassword({
      email: currentEmail,
      password,
    });
    if (verifyError) {
      throw HttpException.badRequest("รหัสผ่านไม่ถูกต้อง");
    }

    const res = await fetch(
      `${this.env.supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: this.env.supabaseServiceKey,
          Authorization: `Bearer ${this.env.supabaseServiceKey}`,
        },
        body: JSON.stringify({ email: newEmail, email_confirm: true }),
      }
    );

    const body = await res.json();
    if (!res.ok) {
      const msg =
        typeof body === "object" && body !== null
          ? (body as Record<string, string>).msg ||
            (body as Record<string, string>).message ||
            ""
          : "";
      if (msg.includes("already") || msg.includes("exists") || res.status === 422) {
        throw HttpException.conflict("อีเมลนี้ถูกใช้งานแล้ว");
      }
      throw HttpException.internal("ไม่สามารถเปลี่ยนอีเมลได้");
    }

    // sync profiles.email
    return this.repository.update(userId, {
      email: newEmail,
    } as Partial<UserProfile>);
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const { error } = await this.db.auth.resetPasswordForEmail(email);
    if (error) {
      throw HttpException.badRequest(error.message);
    }
  }

  public async listUsers(
    page = 1,
    limit = 50
  ): Promise<{ users: UserProfile[]; total: number }> {
    const adminDb = Database.getInstance().getAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await adminDb
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw HttpException.internal("ไม่สามารถดึงรายชื่อผู้ใช้ได้");
    }

    return {
      users: (data ?? []) as UserProfile[],
      total: count ?? 0,
    };
  }

  public async changeUserRole(
    userId: string,
    newRole: string,
    callerRole?: string
  ): Promise<UserProfile> {
    const profile = await this.repository.findById(userId);
    if (!profile) {
      throw HttpException.notFound("ไม่พบผู้ใช้");
    }

    if (
      newRole === "superadmin" &&
      callerRole !== "superadmin"
    ) {
      throw HttpException.forbidden(
        "เฉพาะ superadmin เท่านั้นที่สามารถแต่งตั้ง superadmin ได้"
      );
    }

    if (
      profile.role === "superadmin" &&
      callerRole !== "superadmin"
    ) {
      throw HttpException.forbidden("ไม่สามารถเปลี่ยน role ของ superadmin ได้");
    }

    const updated = await this.repository.update(userId, {
      role: newRole,
    } as Partial<UserProfile>);

    return updated;
  }

  // ========================
  // SuperAdmin methods
  // ========================

  public async createStaff(dto: CreateStaffDto): Promise<UserProfile> {
    const created = await this.adminCreateUser(dto.email, dto.password, {
      full_name: dto.full_name,
      phone: dto.phone,
    });

    let profile = await this.repository.findById(created.id);
    if (!profile) {
      profile = await this.repository.upsertProfile({
        id: created.id,
        email: dto.email,
        full_name: dto.full_name,
        phone: dto.phone ?? null,
      });
    }

    return this.repository.update(created.id, {
      role: dto.role,
    } as Partial<UserProfile>);
  }

  public async listStaff(
    page = 1,
    limit = 50
  ): Promise<{ users: UserProfile[]; total: number }> {
    const adminDb = Database.getInstance().getAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await adminDb
      .from("profiles")
      .select("*", { count: "exact" })
      .in("role", ["reseller", "manager"])
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw HttpException.internal("ไม่สามารถดึงรายชื่อพนักงานได้");

    return { users: (data ?? []) as UserProfile[], total: count ?? 0 };
  }

  public async toggleUserActive(
    userId: string,
    active: boolean
  ): Promise<UserProfile> {
    const profile = await this.repository.findById(userId);
    if (!profile) throw HttpException.notFound("ไม่พบผู้ใช้");

    if (profile.role === "superadmin") {
      throw HttpException.forbidden("ไม่สามารถระงับ superadmin ได้");
    }

    const res = await fetch(
      `${this.env.supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          apikey: this.env.supabaseServiceKey,
          Authorization: `Bearer ${this.env.supabaseServiceKey}`,
        },
        body: JSON.stringify({
          ban_duration: active ? "none" : "876000h",
        }),
      }
    );

    if (!res.ok) throw HttpException.internal("ไม่สามารถอัปเดตสถานะผู้ใช้ได้");

    return profile;
  }

  public async deleteUser(userId: string): Promise<void> {
    const profile = await this.repository.findById(userId);
    if (!profile) throw HttpException.notFound("ไม่พบผู้ใช้");

    if (profile.role === "superadmin") {
      throw HttpException.forbidden("ไม่สามารถลบ superadmin ได้");
    }

    const res = await fetch(
      `${this.env.supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          apikey: this.env.supabaseServiceKey,
          Authorization: `Bearer ${this.env.supabaseServiceKey}`,
        },
      }
    );

    if (!res.ok) throw HttpException.internal("ไม่สามารถลบผู้ใช้ได้");

    const adminDb = Database.getInstance().getAdminClient();
    await adminDb.from("profiles").delete().eq("id", userId);
  }

  public async getSystemStats(): Promise<{
    totalUsers: number;
    totalCustomers: number;
    totalResellers: number;
    totalManagers: number;
  }> {
    const adminDb = Database.getInstance().getAdminClient();
    const { data, error } = await adminDb.from("profiles").select("role");
    if (error) throw HttpException.internal("ไม่สามารถดึงสถิติได้");

    const roles = (data ?? []).map((r) => r.role);
    return {
      totalUsers: roles.length,
      totalCustomers: roles.filter((r) => r === "customer").length,
      totalResellers: roles.filter((r) => r === "reseller").length,
      totalManagers: roles.filter((r) => r === "manager").length,
    };
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
