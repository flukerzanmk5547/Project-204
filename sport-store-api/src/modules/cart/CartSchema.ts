import { z } from "zod";

export class CartSchema {
  public static readonly addItem = z.object({
    product_id: z.string().uuid("Product ID ไม่ถูกต้อง"),
    quantity: z.number().int().positive("จำนวนต้องมากกว่า 0"),
    size: z.string().optional(),
    color: z.string().optional(),
  });

  public static readonly updateItem = z.object({
    quantity: z.number().int().positive("จำนวนต้องมากกว่า 0"),
  });

  public static readonly params = z.object({
    id: z.string().uuid("ID ไม่ถูกต้อง"),
  });
}

export type AddCartItemDto = z.infer<typeof CartSchema.addItem>;
export type UpdateCartItemDto = z.infer<typeof CartSchema.updateItem>;

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number | null;
    images: string[];
    brand: string;
    stock: number;
  };
}
