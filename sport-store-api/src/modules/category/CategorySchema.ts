import { z } from "zod";

export class CategorySchema {
  public static readonly create = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อหมวดหมู่"),
    slug: z.string().min(1, "กรุณาระบุ slug"),
    route_path: z.string().min(1, "กรุณาระบุ route path"),
    description: z.string().optional(),
    image: z.string().optional(),
    icon_name: z.string().optional(),
    parent_id: z.string().uuid().nullable().optional().default(null),
    level: z.number().int().min(0).optional().default(0),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
    banner_image: z.string().optional(),
    banner_title: z.string().optional(),
    banner_subtitle: z.string().optional(),
    banner_cta: z.string().optional(),
  });

  public static readonly update = CategorySchema.create.partial();

  public static readonly query = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
    parent_id: z.string().uuid().optional(),
    level: z.coerce.number().int().optional(),
    is_active: z.coerce.boolean().optional(),
  });

  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });

  public static readonly slugParams = z.object({
    slug: z.string().min(1),
  });

  public static readonly routeParams = z.object({
    path: z.string().min(1),
  });
}

export type CreateCategoryDto = z.infer<typeof CategorySchema.create>;
export type UpdateCategoryDto = z.infer<typeof CategorySchema.update>;
export type CategoryQueryDto = z.infer<typeof CategorySchema.query>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  route_path: string;
  description: string | null;
  image: string | null;
  icon_name: string | null;
  parent_id: string | null;
  level: number;
  sort_order: number;
  is_active: boolean;
  banner_image: string | null;
  banner_title: string | null;
  banner_subtitle: string | null;
  banner_cta: string | null;
  created_at: string;
  updated_at: string;
}
