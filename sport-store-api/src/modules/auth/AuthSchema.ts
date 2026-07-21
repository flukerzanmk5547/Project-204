import { z } from "zod";

export class AuthSchema {
  public static readonly register = z.object({
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    full_name: z.string().min(1, "กรุณาระบุชื่อ-นามสกุล"),
    phone: z.string().optional(),
  });

  public static readonly login = z.object({
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    password: z.string().min(1, "กรุณาระบุรหัสผ่าน"),
  });

  public static readonly loginPhone = z.object({
    phone: z.string().min(10, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  });

  public static readonly resetPassword = z.object({
    email: z.string().email("อีเมลไม่ถูกต้อง"),
  });

  public static readonly updatePassword = z.object({
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  });

  public static readonly updateProfile = z.object({
    full_name: z.string().min(1).optional(),
    phone: z.string().optional(),
    avatar_url: z.string().url().optional(),
  });

  public static readonly changePassword = z.object({
    current_password: z.string().min(1, "กรุณาระบุรหัสผ่านปัจจุบัน"),
    new_password: z.string().min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"),
  });

  public static readonly changeEmail = z.object({
    new_email: z.string().email("อีเมลใหม่ไม่ถูกต้อง"),
    password: z.string().min(1, "กรุณาระบุรหัสผ่านเพื่อยืนยัน"),
  });

  public static readonly changeRole = z.object({
    role: z.enum(["customer", "reseller", "manager", "superadmin"], {
      errorMap: () => ({ message: "role ต้องเป็น customer, reseller, manager หรือ superadmin" }),
    }),
  });

  public static readonly createStaff = z.object({
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    full_name: z.string().min(1, "กรุณาระบุชื่อ-นามสกุล"),
    phone: z.string().optional(),
    role: z.enum(["reseller", "manager"], {
      errorMap: () => ({ message: "role ต้องเป็น reseller หรือ manager" }),
    }),
  });
}

export type RegisterDto = z.infer<typeof AuthSchema.register>;
export type CreateStaffDto = z.infer<typeof AuthSchema.createStaff>;
export type LoginDto = z.infer<typeof AuthSchema.login>;
export type LoginPhoneDto = z.infer<typeof AuthSchema.loginPhone>;
export type ResetPasswordDto = z.infer<typeof AuthSchema.resetPassword>;
export type UpdatePasswordDto = z.infer<typeof AuthSchema.updatePassword>;
export type UpdateProfileDto = z.infer<typeof AuthSchema.updateProfile>;
export type ChangePasswordDto = z.infer<typeof AuthSchema.changePassword>;
export type ChangeEmailDto = z.infer<typeof AuthSchema.changeEmail>;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserProfile;
}
