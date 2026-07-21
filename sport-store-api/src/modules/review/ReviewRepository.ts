import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";
import type { ReviewEntity } from "./ReviewSchema.js";

export class ReviewRepository {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getAdminClient();
  }

  public async findByProduct(
    productId: string,
    page = 1,
    limit = 20
  ): Promise<{ data: ReviewEntity[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.db
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(`Failed to fetch reviews: ${error.message}`);
    return { data: (data ?? []) as ReviewEntity[], count: count ?? 0 };
  }

  /** ดึงเฉพาะ rating ทั้งหมดของสินค้า ไว้คำนวณค่าเฉลี่ย/สรุปดาว */
  public async findRatings(productId: string): Promise<number[]> {
    const { data } = await this.db
      .from("reviews")
      .select("rating")
      .eq("product_id", productId);
    return (data ?? []).map((d) => (d as { rating: number }).rating);
  }

  public async findOne(
    userId: string,
    productId: string
  ): Promise<ReviewEntity | null> {
    const { data } = await this.db
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();
    return data as ReviewEntity | null;
  }

  public async findById(id: string): Promise<ReviewEntity | null> {
    const { data } = await this.db
      .from("reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data as ReviewEntity | null;
  }

  public async upsert(
    payload: Partial<ReviewEntity> & { user_id: string; product_id: string }
  ): Promise<ReviewEntity> {
    const { data, error } = await this.db
      .from("reviews")
      .upsert(payload, { onConflict: "user_id,product_id" })
      .select()
      .single();

    if (error) throw new Error(`Failed to save review: ${error.message}`);
    return data as ReviewEntity;
  }

  public async update(
    id: string,
    payload: Partial<ReviewEntity>
  ): Promise<ReviewEntity> {
    const { data, error } = await this.db
      .from("reviews")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update review: ${error.message}`);
    return data as ReviewEntity;
  }

  public async remove(id: string): Promise<void> {
    const { error } = await this.db.from("reviews").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete review: ${error.message}`);
  }

  /** อัปเดตค่าเฉลี่ยและจำนวนรีวิวกลับไปที่ตาราง products */
  public async syncProductRating(
    productId: string,
    average: number,
    total: number
  ): Promise<void> {
    await this.db
      .from("products")
      .update({ rating: average, review_count: total })
      .eq("id", productId);
  }
}
