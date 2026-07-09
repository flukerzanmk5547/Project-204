import { z } from "zod";

export class PromotionSchema {
  public static readonly create = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อโปรโมชั่น"),
    slug: z.string().min(1, "กรุณาระบุ slug"),
    description: z.string().optional(),
    type: z.enum(["percentage", "fixed_amount", "buy_x_get_y", "label_only"]),
    discount_value: z.number().optional(),
    discount_label: z.string().optional(),
    start_date: z.string().min(1, "กรุณาระบุวันเริ่มต้น"),
    end_date: z.string().optional(),
    is_active: z.boolean().optional().default(true),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly update = PromotionSchema.create.partial();

  public static readonly addProduct = z.object({
    promotion_id: z.string().uuid("Promotion ID ไม่ถูกต้อง"),
    product_id: z.string().uuid("Product ID ไม่ถูกต้อง"),
    override_price: z.number().positive().optional(),
    override_label: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly updateProduct = z.object({
    override_price: z.number().positive().optional().nullable(),
    override_label: z.string().optional().nullable(),
    sort_order: z.number().int().optional(),
  });

  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });
}

export interface Promotion {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "label_only";
  discount_value: number | null;
  discount_label: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  products?: PromotionProduct[];
}

export interface PromotionProduct {
  id: string;
  promotion_id: string;
  product_id: string;
  override_price: number | null;
  override_label: string | null;
  sort_order: number;
  product?: Record<string, unknown>;
}
