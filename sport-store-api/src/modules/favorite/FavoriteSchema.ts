import { z } from "zod";

export class FavoriteSchema {
  public static readonly toggle = z.object({
    product_id: z.string().uuid("product_id ต้องเป็น UUID"),
  });
}

export interface FavoriteEntity {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface FavoriteWithProduct extends FavoriteEntity {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    original_price: number | null;
    images: string[];
    rating: number | null;
    review_count: number;
  } | null;
}
