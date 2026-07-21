import { z } from "zod";

export class FeedbackSchema {
  public static readonly create = z.object({
    rating: z
      .number()
      .int("rating ต้องเป็นจำนวนเต็ม")
      .min(1, "rating ต้องอยู่ระหว่าง 1-10")
      .max(10, "rating ต้องอยู่ระหว่าง 1-10"),
    purpose: z.string().max(200).optional(),
    achieved: z.string().max(100).optional(),
    comment: z.string().max(2000).optional(),
    page_url: z.string().max(500).optional(),
  });
}

export interface FeedbackEntity {
  id: string;
  user_id: string | null;
  rating: number;
  purpose: string | null;
  achieved: string | null;
  comment: string | null;
  page_url: string | null;
  created_at: string;
}

export interface FeedbackSummary {
  average: number;
  total: number;
  /** จำนวนแยกตามคะแนน เช่น { "10": 5, "9": 2, ... } */
  breakdown: Record<string, number>;
  by_purpose: Record<string, number>;
}
