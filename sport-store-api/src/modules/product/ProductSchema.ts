import { z } from "zod";

export class ProductSchema {
  public static readonly create = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อสินค้า"),
    slug: z.string().min(1, "กรุณาระบุ slug"),
    description: z.string().optional(),
    description_full: z.string().optional(),
    price: z.number().positive("ราคาต้องมากกว่า 0"),
    original_price: z.number().positive().optional(),
    brand: z.string().min(1, "กรุณาระบุแบรนด์"),
    sku: z.string().min(1, "กรุณาระบุ SKU"),
    category_id: z.string().uuid("Category ID ไม่ถูกต้อง"),
    images: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    colors: z
      .array(z.object({ name: z.string(), hex: z.string() }))
      .optional()
      .default([]),
    sizes: z.array(z.string()).optional().default([]),
    stock: z.number().int().min(0).optional().default(0),
    is_active: z.boolean().optional().default(true),
    is_featured: z.boolean().optional().default(false),
    is_new: z.boolean().optional().default(false),
    discount_label: z.string().optional(),
    benefits: z.array(z.string()).optional().default([]),
    specifications: z.record(z.string()).optional().default({}),
  });

  public static readonly update = ProductSchema.create.partial();

  public static readonly query = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    sort: z.string().optional().default("created_at"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    category_id: z.string().uuid().optional(),
    brand: z.string().optional(),
    min_price: z.coerce.number().positive().optional(),
    max_price: z.coerce.number().positive().optional(),
    search: z.string().optional(),
    is_active: z.coerce.boolean().optional(),
    is_featured: z.coerce.boolean().optional(),
    is_new: z.coerce.boolean().optional(),
  });

  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });

  public static readonly slugParams = z.object({
    slug: z.string().min(1),
  });
}

export type CreateProductDto = z.infer<typeof ProductSchema.create>;
export type UpdateProductDto = z.infer<typeof ProductSchema.update>;
export type ProductQueryDto = z.infer<typeof ProductSchema.query>;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  description_full: string | null;
  price: number;
  original_price: number | null;
  brand: string;
  sku: string;
  category_id: string;
  images: string[];
  tags: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  discount_label: string | null;
  benefits: string[];
  specifications: Record<string, string>;
  rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}
