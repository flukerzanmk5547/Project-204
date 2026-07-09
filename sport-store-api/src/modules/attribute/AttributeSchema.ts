import { z } from "zod";

export class AttributeSchema {
  public static readonly createGroup = z.object({
    name: z.string().min(1, "กรุณาระบุชื่อ attribute group"),
    slug: z.string().min(1, "กรุณาระบุ slug"),
    display_type: z.enum(["select", "color", "button", "text"]).optional().default("select"),
    unit: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly updateGroup = AttributeSchema.createGroup.partial();

  public static readonly createOption = z.object({
    group_id: z.string().uuid("Group ID ไม่ถูกต้อง"),
    label: z.string().min(1, "กรุณาระบุ label"),
    value: z.string().min(1, "กรุณาระบุ value"),
    color_hex: z.string().optional(),
    sort_order: z.number().int().optional().default(0),
    is_active: z.boolean().optional().default(true),
  });

  public static readonly updateOption = AttributeSchema.createOption.partial();

  public static readonly linkCategory = z.object({
    category_id: z.string().uuid("Category ID ไม่ถูกต้อง"),
    group_id: z.string().uuid("Group ID ไม่ถูกต้อง"),
    is_required: z.boolean().optional().default(false),
    sort_order: z.number().int().optional().default(0),
  });

  public static readonly createVariant = z.object({
    product_id: z.string().uuid("Product ID ไม่ถูกต้อง"),
    sku: z.string().min(1, "กรุณาระบุ SKU"),
    price_override: z.number().positive().optional(),
    stock: z.number().int().min(0).optional().default(0),
    is_active: z.boolean().optional().default(true),
    attributes: z.array(
      z.object({
        group_id: z.string().uuid(),
        option_id: z.string().uuid().optional(),
        custom_value: z.string().optional(),
      })
    ).optional().default([]),
  });

  public static readonly updateVariant = z.object({
    price_override: z.number().positive().optional().nullable(),
    stock: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
  });

  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });
}

export interface AttributeGroup {
  id: string;
  name: string;
  slug: string;
  display_type: string;
  unit: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  options?: AttributeOption[];
}

export interface AttributeOption {
  id: string;
  group_id: string;
  label: string;
  value: string;
  color_hex: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  price_override: number | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attributes?: VariantAttributeValue[];
}

export interface VariantAttributeValue {
  id: string;
  variant_id: string;
  group_id: string;
  option_id: string | null;
  custom_value: string | null;
  group?: AttributeGroup;
  option?: AttributeOption;
}
