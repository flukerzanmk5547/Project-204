import { z } from "zod";

export class ReviewSchema {
  public static readonly create = z.object({
    product_id: z.string().uuid("product_id ต้องเป็น UUID"),
    rating: z
      .number()
      .int("rating ต้องเป็นจำนวนเต็ม")
      .min(1, "rating ต้องอยู่ระหว่าง 1-5")
      .max(5, "rating ต้องอยู่ระหว่าง 1-5"),
    title: z.string().max(200, "หัวข้อยาวเกิน 200 ตัวอักษร").optional(),
    comment: z.string().max(2000, "ข้อความยาวเกิน 2000 ตัวอักษร").optional(),
  });

  public static readonly update = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().max(200).optional(),
    comment: z.string().max(2000).optional(),
  });
}

export interface ReviewEntity {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  author_name: string | null;
  author_country: string | null;
  is_verified: boolean;
  is_translated: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  /** จำนวนรีวิวแยกตามดาว เช่น { "5": 12, "4": 3, ... } */
  breakdown: Record<string, number>;
}
