import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";

interface RecommendationResult {
  product: Record<string, unknown>;
  score: number;
  reason: string;
}

export class RecommendationService {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getClient();
  }

  /**
   * Track a product view (logged-in user or anonymous session)
   */
  public async trackView(productId: string, userId?: string, sessionId?: string): Promise<void> {
    await this.db.from("product_views").insert({
      product_id: productId,
      user_id: userId ?? null,
      session_id: sessionId ?? null,
    });
  }

  /**
   * "ท่านอาจจะชอบสิ่งนี้" — multi-signal recommendation
   *
   * Priority:
   * 1. "คนที่ซื้อสินค้านี้ ยังซื้อ..." (collaborative filtering)
   * 2. Same category products (content-based)
   * 3. Recently viewed similar (user behavior)
   * 4. Popular products fallback
   */
  public async getRecommendations(
    productId: string,
    userId?: string,
    sessionId?: string,
    limit = 8
  ): Promise<RecommendationResult[]> {
    const results: RecommendationResult[] = [];
    const seenIds = new Set<string>([productId]);

    // 1. "คนที่ซื้อสินค้านี้ ยังซื้อ..."
    const coBought = await this.getCoBoughtProducts(productId, limit);
    for (const item of coBought) {
      const id = (item as Record<string, unknown>).id as string;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        results.push({ product: item, score: 100, reason: "bought_together" });
      }
    }

    // 2. Same category
    if (results.length < limit) {
      const sameCat = await this.getSameCategoryProducts(productId, limit - results.length);
      for (const item of sameCat) {
        const id = (item as Record<string, unknown>).id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push({ product: item, score: 70, reason: "same_category" });
        }
      }
    }

    // 3. Based on user's view history
    if ((userId || sessionId) && results.length < limit) {
      const viewed = await this.getViewHistoryBased(productId, userId, sessionId, limit - results.length);
      for (const item of viewed) {
        const id = (item as Record<string, unknown>).id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push({ product: item, score: 50, reason: "view_history" });
        }
      }
    }

    // 4. Fallback: popular products
    if (results.length < limit) {
      const popular = await this.getPopularProducts(limit - results.length);
      for (const item of popular) {
        const id = (item as Record<string, unknown>).id as string;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          results.push({ product: item, score: 30, reason: "popular" });
        }
      }
    }

    return results.slice(0, limit);
  }

  /**
   * Collaborative filtering:
   * หาสินค้าที่คนอื่นซื้อพร้อมกับสินค้านี้ (same order)
   */
  private async getCoBoughtProducts(productId: string, limit: number): Promise<Record<string, unknown>[]> {
    // หา order IDs ที่มีสินค้านี้
    const { data: orderIds } = await this.db
      .from("order_items")
      .select("order_id")
      .eq("product_id", productId);

    if (!orderIds || orderIds.length === 0) return [];

    const ids = orderIds.map((o: { order_id: string }) => o.order_id);

    // หาสินค้าอื่นใน orders เดียวกัน
    const { data } = await this.db
      .from("order_items")
      .select("product:products(*)")
      .in("order_id", ids)
      .neq("product_id", productId)
      .limit(limit);

    if (!data) return [];

    // Deduplicate + count frequency
    const freq = new Map<string, { product: Record<string, unknown>; count: number }>();
    for (const item of data) {
      const product = (item as Record<string, unknown>).product as Record<string, unknown>;
      if (!product) continue;
      const id = product.id as string;
      const existing = freq.get(id);
      if (existing) {
        existing.count++;
      } else {
        freq.set(id, { product, count: 1 });
      }
    }

    return [...freq.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((v) => v.product);
  }

  /**
   * Content-based: สินค้าใน category เดียวกัน เรียงตาม rating
   */
  private async getSameCategoryProducts(productId: string, limit: number): Promise<Record<string, unknown>[]> {
    // หา category ของสินค้าปัจจุบัน
    const { data: product } = await this.db
      .from("products")
      .select("category_id")
      .eq("id", productId)
      .single();

    if (!product) return [];

    const { data } = await this.db
      .from("products")
      .select("*")
      .eq("category_id", (product as { category_id: string }).category_id)
      .eq("is_active", true)
      .neq("id", productId)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    return (data as Record<string, unknown>[]) ?? [];
  }

  /**
   * User behavior: สินค้าใน categories ที่ user เคยดู
   */
  private async getViewHistoryBased(
    excludeProductId: string,
    userId?: string,
    sessionId?: string,
    limit = 8
  ): Promise<Record<string, unknown>[]> {
    let viewQuery = this.db
      .from("product_views")
      .select("product:products(category_id)")
      .neq("product_id", excludeProductId)
      .order("viewed_at", { ascending: false })
      .limit(20);

    if (userId) {
      viewQuery = viewQuery.eq("user_id", userId);
    } else if (sessionId) {
      viewQuery = viewQuery.eq("session_id", sessionId);
    } else {
      return [];
    }

    const { data: views } = await viewQuery;
    if (!views || views.length === 0) return [];

    // Collect unique category IDs from view history
    const catIds = new Set<string>();
    for (const v of views) {
      const product = (v as Record<string, unknown>).product as Record<string, unknown> | null;
      if (product?.category_id) catIds.add(product.category_id as string);
    }

    if (catIds.size === 0) return [];

    const { data } = await this.db
      .from("products")
      .select("*")
      .in("category_id", [...catIds])
      .eq("is_active", true)
      .neq("id", excludeProductId)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    return (data as Record<string, unknown>[]) ?? [];
  }

  /**
   * Fallback: สินค้ายอดนิยม (rating สูง + review เยอะ)
   */
  private async getPopularProducts(limit: number): Promise<Record<string, unknown>[]> {
    const { data } = await this.db
      .from("products")
      .select("*")
      .eq("is_active", true)
      .not("rating", "is", null)
      .order("review_count", { ascending: false })
      .order("rating", { ascending: false })
      .limit(limit);

    return (data as Record<string, unknown>[]) ?? [];
  }

  /**
   * "สินค้ายอดนิยม" — sorted by views in last N days
   */
  public async getTrending(days = 7, limit = 12): Promise<Record<string, unknown>[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data: viewCounts } = await this.db
      .from("product_views")
      .select("product_id")
      .gte("viewed_at", since.toISOString());

    if (!viewCounts || viewCounts.length === 0) {
      return this.getPopularProducts(limit);
    }

    const freq = new Map<string, number>();
    for (const v of viewCounts) {
      const pid = (v as { product_id: string }).product_id;
      freq.set(pid, (freq.get(pid) ?? 0) + 1);
    }

    const topIds = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (topIds.length === 0) return this.getPopularProducts(limit);

    const { data } = await this.db
      .from("products")
      .select("*")
      .in("id", topIds)
      .eq("is_active", true);

    return (data as Record<string, unknown>[]) ?? [];
  }
}
