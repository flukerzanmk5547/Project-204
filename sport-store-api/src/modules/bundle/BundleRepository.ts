import type { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "../../shared/BaseRepository.js";
import { Database } from "../../config/Database.js";
import type {
  ProductBundle,
  BundleItem,
  BundleItemWithProduct,
} from "./BundleSchema.js";

export class BundleRepository extends BaseRepository<ProductBundle> {
  private readonly bundleItemsTable;
  private readonly linksTable;

  constructor() {
    super("product_bundles");
    const db: SupabaseClient = Database.getInstance().getAdminClient();
    this.bundleItemsTable = db.from("bundle_items");
    this.linksTable = db.from("product_bundle_links");
  }

  public async findBySlug(slug: string): Promise<ProductBundle | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return data as ProductBundle;
  }

  public async findActiveBundles(): Promise<ProductBundle[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as ProductBundle[];
  }

  // --- Bundle Items ---

  public async getBundleItems(bundleId: string): Promise<BundleItemWithProduct[]> {
    const { data, error } = await this.bundleItemsTable
      .select(
        `
        *,
        product:products(id, name, slug, price, original_price, images, brand, colors, sizes)
      `
      )
      .eq("bundle_id", bundleId)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as unknown as BundleItemWithProduct[];
  }

  public async addBundleItem(
    bundleId: string,
    productId: string,
    quantity: number,
    sortOrder: number
  ): Promise<BundleItem> {
    const { data, error } = await this.bundleItemsTable
      .insert({
        bundle_id: bundleId,
        product_id: productId,
        quantity,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as BundleItem;
  }

  public async removeBundleItem(itemId: string): Promise<void> {
    const { error } = await this.bundleItemsTable
      .delete()
      .eq("id", itemId);

    if (error) throw new Error(error.message);
  }

  public async updateBundleItem(
    itemId: string,
    updates: Partial<Pick<BundleItem, "quantity" | "sort_order">>
  ): Promise<BundleItem> {
    const { data, error } = await this.bundleItemsTable
      .update(updates)
      .eq("id", itemId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as BundleItem;
  }

  // --- Product-Bundle Links ---

  public async getBundlesForProduct(productId: string): Promise<ProductBundle[]> {
    const { data, error } = await this.linksTable
      .select(
        `
        bundle:product_bundles(*)
      `
      )
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(
      (row: Record<string, unknown>) => row.bundle as unknown as ProductBundle
    );
  }

  public async linkBundleToProduct(
    productId: string,
    bundleId: string,
    sortOrder: number
  ): Promise<void> {
    const { error } = await this.linksTable.insert({
      product_id: productId,
      bundle_id: bundleId,
      sort_order: sortOrder,
    });

    if (error) throw new Error(error.message);
  }

  public async unlinkBundleFromProduct(
    productId: string,
    bundleId: string
  ): Promise<void> {
    const { error } = await this.linksTable
      .delete()
      .eq("product_id", productId)
      .eq("bundle_id", bundleId);

    if (error) throw new Error(error.message);
  }
}
