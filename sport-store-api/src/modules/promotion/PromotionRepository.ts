import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";
import type { Promotion, PromotionProduct } from "./PromotionSchema.js";

export class PromotionRepository {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getClient();
  }

  public async findAll(activeOnly = false): Promise<Promotion[]> {
    let query = this.db
      .from("promotions")
      .select("*")
      .order("sort_order", { ascending: true });

    if (activeOnly) {
      query = query
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString());
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch promotions: ${error.message}`);
    return (data as Promotion[]) ?? [];
  }

  public async findById(id: string): Promise<Promotion | null> {
    const { data, error } = await this.db
      .from("promotions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find promotion: ${error.message}`);
    }
    return data as Promotion;
  }

  public async findBySlug(slug: string): Promise<Promotion | null> {
    const { data, error } = await this.db
      .from("promotions")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find promotion: ${error.message}`);
    }
    return data as Promotion;
  }

  public async create(entity: Record<string, unknown>): Promise<Promotion> {
    const { data, error } = await this.db
      .from("promotions")
      .insert(entity)
      .select()
      .single();
    if (error) throw new Error(`Failed to create promotion: ${error.message}`);
    return data as Promotion;
  }

  public async update(id: string, entity: Record<string, unknown>): Promise<Promotion> {
    const { data, error } = await this.db
      .from("promotions")
      .update(entity)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update promotion: ${error.message}`);
    return data as Promotion;
  }

  public async delete(id: string): Promise<void> {
    const { error } = await this.db.from("promotions").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete promotion: ${error.message}`);
  }

  // ---- Promotion Products ----

  public async findProductsByPromotion(promotionId: string): Promise<PromotionProduct[]> {
    const { data, error } = await this.db
      .from("promotion_products")
      .select("*, product:products(*)")
      .eq("promotion_id", promotionId)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch promo products: ${error.message}`);
    return (data as PromotionProduct[]) ?? [];
  }

  public async findActiveDeals(): Promise<PromotionProduct[]> {
    const now = new Date().toISOString();

    const { data: activePromos, error: promoError } = await this.db
      .from("promotions")
      .select("id")
      .eq("is_active", true)
      .lte("start_date", now);

    if (promoError) throw new Error(`Failed to find active promos: ${promoError.message}`);
    if (!activePromos || activePromos.length === 0) return [];

    const promoIds = activePromos.map((p: { id: string }) => p.id);

    const { data, error } = await this.db
      .from("promotion_products")
      .select("*, product:products(*), promotion:promotions(*)")
      .in("promotion_id", promoIds)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch deals: ${error.message}`);
    return (data as PromotionProduct[]) ?? [];
  }

  public async addProduct(entity: Record<string, unknown>): Promise<PromotionProduct> {
    const { data, error } = await this.db
      .from("promotion_products")
      .insert(entity)
      .select("*, product:products(*)")
      .single();
    if (error) throw new Error(`Failed to add product to promotion: ${error.message}`);
    return data as PromotionProduct;
  }

  public async updateProduct(id: string, entity: Record<string, unknown>): Promise<PromotionProduct> {
    const { data, error } = await this.db
      .from("promotion_products")
      .update(entity)
      .eq("id", id)
      .select("*, product:products(*)")
      .single();
    if (error) throw new Error(`Failed to update promo product: ${error.message}`);
    return data as PromotionProduct;
  }

  public async removeProduct(promotionId: string, productId: string): Promise<void> {
    const { error } = await this.db
      .from("promotion_products")
      .delete()
      .eq("promotion_id", promotionId)
      .eq("product_id", productId);
    if (error) throw new Error(`Failed to remove promo product: ${error.message}`);
  }
}
