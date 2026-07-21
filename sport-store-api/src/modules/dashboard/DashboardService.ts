import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";

interface RankItem {
  name: string;
  value: number;
}

interface RecentOrder {
  id: string;
  code: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

export interface DashboardStats {
  summary: {
    sales_total: number;
    order_count: number;
    product_count: number;
    low_stock: number;
    out_of_stock: number;
    orders_today: number;
    new_customers_today: number;
  };
  category_revenue: RankItem[];
  product_revenue: RankItem[];
  top_by_sold: RankItem[];
  top_by_revenue: RankItem[];
  top_categories_by_count: RankItem[];
  top_customers: RankItem[];
  recent_orders: RecentOrder[];
}

interface ProductRow {
  id: string;
  name: string;
  category_id: string | null;
  stock: number | null;
}
interface CategoryRow {
  id: string;
  name: string;
}
interface OrderRow {
  id: string;
  order_number: string | null;
  user_id: string | null;
  shipping_name: string | null;
  total: number | null;
  status: string;
  created_at: string;
}
interface OrderItemRow {
  product_id: string | null;
  name: string | null;
  price: number | null;
  quantity: number | null;
}
interface ProfileRow {
  id: string;
  full_name: string | null;
  role: string | null;
  created_at: string;
}

export class DashboardService {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getAdminClient();
  }

  public async getStats(): Promise<DashboardStats> {
    const [products, categories, orders, items, profiles] = await Promise.all([
      this.fetch<ProductRow>("products", "id, name, category_id, stock"),
      this.fetch<CategoryRow>("categories", "id, name"),
      this.fetch<OrderRow>(
        "orders",
        "id, order_number, user_id, shipping_name, total, status, created_at"
      ),
      this.fetch<OrderItemRow>("order_items", "product_id, name, price, quantity"),
      this.fetch<ProfileRow>("profiles", "id, full_name, role, created_at"),
    ]);

    const isCancelled = (s: string) => s === "cancelled";
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const isToday = (iso: string) => new Date(iso) >= startOfToday;

    // ---- summary ----
    const validOrders = orders.filter((o) => !isCancelled(o.status));
    const salesTotal = validOrders.reduce((s, o) => s + (o.total ?? 0), 0);
    const ordersToday = orders.filter((o) => isToday(o.created_at)).length;
    const newCustomersToday = profiles.filter(
      (p) => (p.role ?? "customer") === "customer" && isToday(p.created_at)
    ).length;
    const lowStock = products.filter(
      (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 15
    ).length;
    const outOfStock = products.filter((p) => (p.stock ?? 0) === 0).length;

    // ---- lookup maps ----
    const categoryName = new Map(categories.map((c) => [c.id, c.name]));
    const productCategory = new Map(
      products.map((p) => [p.id, p.category_id])
    );

    // ---- aggregate order_items ----
    const revenueByProduct = new Map<string, { name: string; value: number }>();
    const soldByProduct = new Map<string, { name: string; value: number }>();
    const revenueByCategory = new Map<string, number>();

    for (const it of items) {
      const revenue = (it.price ?? 0) * (it.quantity ?? 0);
      const qty = it.quantity ?? 0;
      const pid = it.product_id ?? "unknown";
      const label = it.name ?? "ไม่ระบุ";

      const rp = revenueByProduct.get(pid);
      revenueByProduct.set(pid, {
        name: label,
        value: (rp?.value ?? 0) + revenue,
      });

      const sp = soldByProduct.get(pid);
      soldByProduct.set(pid, { name: label, value: (sp?.value ?? 0) + qty });

      const catId = productCategory.get(pid) ?? null;
      const catName = catId ? (categoryName.get(catId) ?? "อื่นๆ") : "อื่นๆ";
      revenueByCategory.set(
        catName,
        (revenueByCategory.get(catName) ?? 0) + revenue
      );
    }

    // ---- products count per category (จำนวนสินค้า) ----
    const countByCategory = new Map<string, number>();
    for (const p of products) {
      const catName = p.category_id
        ? (categoryName.get(p.category_id) ?? "อื่นๆ")
        : "อื่นๆ";
      countByCategory.set(catName, (countByCategory.get(catName) ?? 0) + 1);
    }

    // ---- top customers (ตามจำนวนออเดอร์) ----
    const ordersByCustomer = new Map<string, number>();
    for (const o of validOrders) {
      const key = o.shipping_name?.trim() || "ลูกค้าทั่วไป";
      ordersByCustomer.set(key, (ordersByCustomer.get(key) ?? 0) + 1);
    }

    const toSorted = (m: Map<string, { name: string; value: number }>) =>
      [...m.values()].sort((a, b) => b.value - a.value);
    const mapToRank = (m: Map<string, number>) =>
      [...m.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const recentOrders: RecentOrder[] = [...orders]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 8)
      .map((o) => ({
        id: o.id,
        code: o.order_number ?? o.id.slice(0, 8),
        customer: o.shipping_name ?? "ลูกค้าทั่วไป",
        total: o.total ?? 0,
        status: o.status,
        date: o.created_at,
      }));

    return {
      summary: {
        sales_total: salesTotal,
        order_count: orders.length,
        product_count: products.length,
        low_stock: lowStock,
        out_of_stock: outOfStock,
        orders_today: ordersToday,
        new_customers_today: newCustomersToday,
      },
      category_revenue: mapToRank(revenueByCategory),
      product_revenue: toSorted(revenueByProduct),
      top_by_sold: toSorted(soldByProduct).slice(0, 10),
      top_by_revenue: toSorted(revenueByProduct).slice(0, 10),
      top_categories_by_count: mapToRank(countByCategory),
      top_customers: mapToRank(ordersByCustomer).slice(0, 10),
      recent_orders: recentOrders,
    };
  }

  private async fetch<T>(table: string, columns: string): Promise<T[]> {
    const { data, error } = await this.db.from(table).select(columns);
    if (error) {
      throw new Error(`Failed to fetch ${table}: ${error.message}`);
    }
    return (data as T[]) ?? [];
  }
}
