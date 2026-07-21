import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";

interface RankItem {
  id: string;
  name: string;
  image: string | null;
  value: number;
}

interface FavoriteAnalytics {
  total_favorites: number;
  unique_products: number;
  unique_users: number;
  top_favorited_products: RankItem[];
  recent_favorites: {
    user_name: string;
    product_name: string;
    product_image: string | null;
    created_at: string;
  }[];
}

interface ViewAnalytics {
  total_views: number;
  unique_products_viewed: number;
  unique_users: number;
  top_viewed_products: RankItem[];
  views_today: number;
  views_this_week: number;
}

interface PurchaseAnalytics {
  total_orders: number;
  total_revenue: number;
  total_items_sold: number;
  top_purchased_products: RankItem[];
  average_order_value: number;
  orders_today: number;
}

export interface FullAnalytics {
  favorites: FavoriteAnalytics;
  views: ViewAnalytics;
  purchases: PurchaseAnalytics;
}

export class AnalyticsService {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getAdminClient();
  }

  public async getFullAnalytics(): Promise<FullAnalytics> {
    const [favorites, views, purchases] = await Promise.all([
      this.getFavoriteAnalytics(),
      this.getViewAnalytics(),
      this.getPurchaseAnalytics(),
    ]);
    return { favorites, views, purchases };
  }

  public async getFavoriteAnalytics(): Promise<FavoriteAnalytics> {
    const { data: favs } = await this.db
      .from("user_favorites")
      .select("id, user_id, product_id, created_at");
    const allFavs = (favs ?? []) as {
      id: string;
      user_id: string;
      product_id: string;
      created_at: string;
    }[];

    const uniqueProducts = new Set(allFavs.map((f) => f.product_id));
    const uniqueUsers = new Set(allFavs.map((f) => f.user_id));

    // Top favorited products
    const countMap = new Map<string, number>();
    for (const f of allFavs) {
      countMap.set(f.product_id, (countMap.get(f.product_id) ?? 0) + 1);
    }
    const topIds = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const productIds = topIds.map(([id]) => id);
    const { data: products } = await this.db
      .from("products")
      .select("id, name, images")
      .in("id", productIds.length > 0 ? productIds : ["__none__"]);
    const prodMap = new Map(
      (products ?? []).map((p: { id: string; name: string; images: string[] }) => [
        p.id,
        { name: p.name, image: p.images?.[0] ?? null },
      ])
    );

    const topFavorited: RankItem[] = topIds.map(([id, count]) => ({
      id,
      name: prodMap.get(id)?.name ?? "ไม่ระบุ",
      image: prodMap.get(id)?.image ?? null,
      value: count,
    }));

    // Recent favorites with user+product info
    const { data: recentRaw } = await this.db
      .from("user_favorites")
      .select(
        "created_at, product:products(name, images), profile:profiles!user_favorites_user_id_fkey(full_name)"
      )
      .order("created_at", { ascending: false })
      .limit(10);

    const recent = ((recentRaw ?? []) as unknown as {
      created_at: string;
      product: { name: string; images: string[] } | { name: string; images: string[] }[] | null;
      profile: { full_name: string } | { full_name: string }[] | null;
    }[]).map((r) => {
      const prod = Array.isArray(r.product) ? r.product[0] : r.product;
      const prof = Array.isArray(r.profile) ? r.profile[0] : r.profile;
      return {
        user_name: prof?.full_name ?? "ไม่ระบุ",
        product_name: prod?.name ?? "ไม่ระบุ",
        product_image: prod?.images?.[0] ?? null,
        created_at: r.created_at,
      };
    });

    return {
      total_favorites: allFavs.length,
      unique_products: uniqueProducts.size,
      unique_users: uniqueUsers.size,
      top_favorited_products: topFavorited,
      recent_favorites: recent,
    };
  }

  public async getViewAnalytics(): Promise<ViewAnalytics> {
    const { data: views } = await this.db
      .from("product_views")
      .select("id, product_id, user_id, viewed_at");
    const allViews = (views ?? []) as {
      id: string;
      product_id: string;
      user_id: string | null;
      viewed_at: string;
    }[];

    const uniqueProducts = new Set(allViews.map((v) => v.product_id));
    const uniqueUsers = new Set(
      allViews.filter((v) => v.user_id).map((v) => v.user_id!)
    );

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const viewsToday = allViews.filter(
      (v) => new Date(v.viewed_at) >= startOfToday
    ).length;
    const viewsThisWeek = allViews.filter(
      (v) => new Date(v.viewed_at) >= startOfWeek
    ).length;

    // Top viewed products
    const countMap = new Map<string, number>();
    for (const v of allViews) {
      countMap.set(v.product_id, (countMap.get(v.product_id) ?? 0) + 1);
    }
    const topIds = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const pIds = topIds.map(([id]) => id);
    const { data: products } = await this.db
      .from("products")
      .select("id, name, images")
      .in("id", pIds.length > 0 ? pIds : ["__none__"]);
    const prodMap = new Map(
      (products ?? []).map((p: { id: string; name: string; images: string[] }) => [
        p.id,
        { name: p.name, image: p.images?.[0] ?? null },
      ])
    );

    const topViewed: RankItem[] = topIds.map(([id, count]) => ({
      id,
      name: prodMap.get(id)?.name ?? "ไม่ระบุ",
      image: prodMap.get(id)?.image ?? null,
      value: count,
    }));

    return {
      total_views: allViews.length,
      unique_products_viewed: uniqueProducts.size,
      unique_users: uniqueUsers.size,
      top_viewed_products: topViewed,
      views_today: viewsToday,
      views_this_week: viewsThisWeek,
    };
  }

  public async getPurchaseAnalytics(): Promise<PurchaseAnalytics> {
    const { data: orders } = await this.db
      .from("orders")
      .select("id, total, status, created_at");
    const allOrders = (orders ?? []) as {
      id: string;
      total: number;
      status: string;
      created_at: string;
    }[];

    const validOrders = allOrders.filter((o) => o.status !== "cancelled");
    const totalRevenue = validOrders.reduce((s, o) => s + (o.total ?? 0), 0);

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const ordersToday = allOrders.filter(
      (o) => new Date(o.created_at) >= startOfToday
    ).length;

    const { data: items } = await this.db
      .from("order_items")
      .select("product_id, name, price, quantity");
    const allItems = (items ?? []) as {
      product_id: string | null;
      name: string | null;
      price: number;
      quantity: number;
    }[];

    const totalSold = allItems.reduce((s, i) => s + (i.quantity ?? 0), 0);

    // Top purchased
    const soldMap = new Map<
      string,
      { name: string; value: number }
    >();
    for (const it of allItems) {
      const pid = it.product_id ?? "unknown";
      const label = it.name ?? "ไม่ระบุ";
      const prev = soldMap.get(pid);
      soldMap.set(pid, {
        name: label,
        value: (prev?.value ?? 0) + (it.quantity ?? 0),
      });
    }
    const topPurchased = [...soldMap.entries()]
      .sort((a, b) => b[1].value - a[1].value)
      .slice(0, 10);

    const pIds = topPurchased.map(([id]) => id).filter((id) => id !== "unknown");
    const { data: products } = await this.db
      .from("products")
      .select("id, images")
      .in("id", pIds.length > 0 ? pIds : ["__none__"]);
    const imgMap = new Map(
      (products ?? []).map((p: { id: string; images: string[] }) => [
        p.id,
        p.images?.[0] ?? null,
      ])
    );

    const topPurchasedItems: RankItem[] = topPurchased.map(([id, item]) => ({
      id,
      name: item.name,
      image: imgMap.get(id) ?? null,
      value: item.value,
    }));

    return {
      total_orders: allOrders.length,
      total_revenue: totalRevenue,
      total_items_sold: totalSold,
      top_purchased_products: topPurchasedItems,
      average_order_value:
        validOrders.length > 0 ? totalRevenue / validOrders.length : 0,
      orders_today: ordersToday,
    };
  }
}
