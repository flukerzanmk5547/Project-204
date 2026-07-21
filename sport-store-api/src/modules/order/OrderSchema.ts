import { z } from "zod";

export class OrderSchema {
  public static readonly createItem = z.object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid().optional(),
    name: z.string(),
    image: z.string().optional(),
    brand: z.string().optional(),
    size: z.string().optional(),
    price: z.number().positive(),
    original_price: z.number().positive().optional(),
    quantity: z.number().int().positive(),
  });

  public static readonly create = z.object({
    address_id: z.string().uuid().optional(),
    shipping_name: z.string().min(1),
    shipping_phone: z.string().min(9),
    shipping_address: z.string().min(1),
    shipping_province: z.string().min(1),
    shipping_amphoe: z.string().min(1),
    shipping_district: z.string().optional(),
    shipping_postal_code: z.string().length(5),
    shipping_note: z.string().optional(),
    payment_method: z.enum(["promptpay", "credit", "bank", "gift"]),
    items: z.array(OrderSchema.createItem).min(1, "ต้องมีอย่างน้อย 1 รายการ"),
  });
}

export interface OrderEntity {
  id: string;
  user_id: string | null;
  order_number: string;
  status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_province: string;
  shipping_amphoe: string;
  shipping_district: string | null;
  shipping_postal_code: string;
  shipping_note: string | null;
  payment_method: string;
  subtotal: number;
  discount_total: number;
  shipping_cost: number;
  total: number;
  is_test: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItemEntity {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  image: string | null;
  brand: string | null;
  size: string | null;
  price: number;
  original_price: number | null;
  quantity: number;
  created_at: string;
}

export type CreateOrderDto = z.infer<typeof OrderSchema.create>;
