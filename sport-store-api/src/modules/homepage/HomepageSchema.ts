import { z } from "zod";

export class HomepageSchema {
  // --- Homepage Section ---
  public static readonly createSection = z.object({
    title: z.string().min(1, "กรุณาระบุชื่อ section"),
    slug: z.string().min(1, "กรุณาระบุ slug"),
    type: z.enum(["deals", "category", "featured"]),
    category_id: z.string().uuid().nullable().optional().default(null),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  });

  public static readonly updateSection = HomepageSchema.createSection.partial();

  // --- Sub Category Item ---
  public static readonly createSubCategory = z.object({
    section_id: z.string().uuid("Section ID ไม่ถูกต้อง"),
    category_id: z.string().uuid().nullable().optional().default(null),
    label: z.string().min(1, "กรุณาระบุ label"),
    image: z.string().optional(),
    icon_name: z.string().optional(),
    link: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  });

  public static readonly updateSubCategory =
    HomepageSchema.createSubCategory.partial();

  // --- Section ↔ Product mapping ---
  public static readonly addProduct = z.object({
    product_id: z.string().uuid("Product ID ไม่ถูกต้อง"),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly addProducts = z.object({
    products: z
      .array(HomepageSchema.addProduct)
      .min(1, "ต้องมีสินค้าอย่างน้อย 1 ชิ้น"),
  });

  // --- Category Shortcut ---
  public static readonly createShortcut = z.object({
    label: z.string().min(1, "กรุณาระบุ label"),
    image: z.string().optional(),
    text_overlay: z.string().optional(),
    link: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  });

  public static readonly updateShortcut =
    HomepageSchema.createShortcut.partial();

  // --- Site Config ---
  public static readonly updateConfig = z.object({
    value: z.string().min(1, "กรุณาระบุค่า"),
    type: z
      .enum(["string", "number", "boolean", "json"])
      .optional()
      .default("string"),
    description: z.string().optional(),
  });

  // --- Params ---
  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });

  public static readonly keyParams = z.object({
    key: z.string().min(1, "กรุณาระบุ key"),
  });

  public static readonly sectionProductParams = z.object({
    id: z.string().uuid("Section ID ไม่ถูกต้อง"),
    productId: z.string().uuid("Product ID ไม่ถูกต้อง"),
  });
}

export type CreateSectionDto = z.infer<typeof HomepageSchema.createSection>;
export type UpdateSectionDto = z.infer<typeof HomepageSchema.updateSection>;
export type CreateSubCategoryDto = z.infer<
  typeof HomepageSchema.createSubCategory
>;
export type UpdateSubCategoryDto = z.infer<
  typeof HomepageSchema.updateSubCategory
>;
export type AddProductDto = z.infer<typeof HomepageSchema.addProduct>;
export type CreateShortcutDto = z.infer<typeof HomepageSchema.createShortcut>;
export type UpdateShortcutDto = z.infer<typeof HomepageSchema.updateShortcut>;
export type UpdateConfigDto = z.infer<typeof HomepageSchema.updateConfig>;
