import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";
import type { FavoriteEntity, FavoriteWithProduct } from "./FavoriteSchema.js";

export class FavoriteRepository {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getAdminClient();
  }

  public async findByUser(
    userId: string,
    page = 1,
    limit = 50
  ): Promise<{ data: FavoriteWithProduct[]; count: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.db
      .from("user_favorites")
      .select(
        "*, product:products(id, name, slug, brand, price, original_price, images, rating, review_count)",
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(`Failed to fetch favorites: ${error.message}`);
    return { data: (data ?? []) as FavoriteWithProduct[], count: count ?? 0 };
  }

  public async findOne(
    userId: string,
    productId: string
  ): Promise<FavoriteEntity | null> {
    const { data } = await this.db
      .from("user_favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();
    return data as FavoriteEntity | null;
  }

  public async add(userId: string, productId: string): Promise<FavoriteEntity> {
    const { data, error } = await this.db
      .from("user_favorites")
      .upsert(
        { user_id: userId, product_id: productId },
        { onConflict: "user_id,product_id" }
      )
      .select()
      .single();

    if (error) throw new Error(`Failed to add favorite: ${error.message}`);
    return data as FavoriteEntity;
  }

  public async remove(userId: string, productId: string): Promise<void> {
    const { error } = await this.db
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw new Error(`Failed to remove favorite: ${error.message}`);
  }

  public async countByUser(userId: string): Promise<number> {
    const { count, error } = await this.db
      .from("user_favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) return 0;
    return count ?? 0;
  }

  public async getProductIds(userId: string): Promise<string[]> {
    const { data } = await this.db
      .from("user_favorites")
      .select("product_id")
      .eq("user_id", userId);
    return (data ?? []).map((d) => (d as { product_id: string }).product_id);
  }
}
