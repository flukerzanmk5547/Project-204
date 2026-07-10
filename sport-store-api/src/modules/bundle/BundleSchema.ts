import { z } from "zod";

export class BundleSchema {
  public static readonly create = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อ bundle"),
    slug: z.string().min(1, "กรุณาระบุ slug"),
    description: z.string().optional(),
    discount_type: z
      .enum(["none", "percentage", "fixed_amount", "fixed_price"])
      .default("none"),
    discount_value: z.number().min(0).default(0),
    is_active: z.boolean().optional().default(true),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly update = BundleSchema.create.partial();

  public static readonly addItem = z.object({
    product_id: z.string().uuid("Product ID ไม่ถูกต้อง"),
    quantity: z.number().int().positive().default(1),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly addItems = z.object({
    items: z.array(BundleSchema.addItem).min(1, "ต้องมีสินค้าอย่างน้อย 1 ชิ้น"),
  });

  public static readonly linkToProduct = z.object({
    product_id: z.string().uuid("Product ID ไม่ถูกต้อง"),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly params = z.object({
    id: z.string().uuid("Bundle ID ไม่ถูกต้อง"),
  });

  public static readonly itemParams = z.object({
    id: z.string().uuid("Bundle ID ไม่ถูกต้อง"),
    itemId: z.string().uuid("Item ID ไม่ถูกต้อง"),
  });
}

export type CreateBundleDto = z.infer<typeof BundleSchema.create>;
export type UpdateBundleDto = z.infer<typeof BundleSchema.update>;
export type AddBundleItemDto = z.infer<typeof BundleSchema.addItem>;
export type LinkToProductDto = z.infer<typeof BundleSchema.linkToProduct>;

export interface ProductBundle {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  discount_type: "none" | "percentage" | "fixed_amount" | "fixed_price";
  discount_value: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  product_id: string;
  quantity: number;
  sort_order: number;
}

export interface BundleItemWithProduct extends BundleItem {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price: number | null;
    images: string[];
    brand: string;
    colors: { name: string; hex: string }[];
    sizes: string[];
  };
}

export interface BundleWithItems extends ProductBundle {
  items: BundleItemWithProduct[];
  total_original_price: number;
  total_bundle_price: number;
  savings: number;
}
