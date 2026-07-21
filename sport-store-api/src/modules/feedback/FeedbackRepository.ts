import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";
import type { FeedbackEntity } from "./FeedbackSchema.js";

export class FeedbackRepository {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getAdminClient();
  }

  public async create(
    payload: Omit<FeedbackEntity, "id" | "created_at">
  ): Promise<FeedbackEntity> {
    const { data, error } = await this.db
      .from("feedbacks")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`Failed to save feedback: ${error.message}`);
    return data as FeedbackEntity;
  }

  public async findAll(
    page = 1,
    limit = 50
  ): Promise<{ data: FeedbackEntity[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.db
      .from("feedbacks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(`Failed to fetch feedbacks: ${error.message}`);
    return { data: (data ?? []) as FeedbackEntity[], count: count ?? 0 };
  }

  /** ดึงเฉพาะ rating + purpose ไว้คำนวณสรุป */
  public async findForSummary(): Promise<
    { rating: number; purpose: string | null }[]
  > {
    const { data } = await this.db.from("feedbacks").select("rating, purpose");
    return (data ?? []) as { rating: number; purpose: string | null }[];
  }
}
