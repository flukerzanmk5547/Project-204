import { z } from "zod";

export class BannerSchema {
  public static readonly create = z.object({
    type: z.enum(["hero", "category", "promo"]),
    title: z.string().min(1, "กรุณาระบุหัวข้อ"),
    subtitle: z.string().optional(),
    hashtag: z.string().optional(),
    cta: z.string().optional(),
    image: z.string().min(1, "กรุณาระบุรูปภาพ"),
    link: z.string().optional(),
    section_key: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  });

  public static readonly update = BannerSchema.create.partial();

  public static readonly query = z.object({
    type: z.enum(["hero", "category", "promo"]).optional(),
    section_key: z.string().optional(),
    is_active: z.coerce.boolean().optional(),
  });

  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });
}

export type CreateBannerDto = z.infer<typeof BannerSchema.create>;
export type UpdateBannerDto = z.infer<typeof BannerSchema.update>;
export type BannerQueryDto = z.infer<typeof BannerSchema.query>;

export interface Banner {
  id: string;
  type: "hero" | "category" | "promo";
  title: string;
  subtitle: string | null;
  hashtag: string | null;
  cta: string | null;
  image: string;
  link: string | null;
  section_key: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
