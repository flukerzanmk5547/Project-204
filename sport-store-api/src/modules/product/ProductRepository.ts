import { BaseRepository } from "../../shared/BaseRepository.js";
import type { Product, ProductQueryDto } from "./ProductSchema.js";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super("products");
  }

  public async findWithFilters(
    query: ProductQueryDto
  ): Promise<{ data: Product[]; count: number }> {
    const { page = 1, limit = 20, sort = "created_at", order = "desc" } = query;
    const offset = (page - 1) * limit;

    let dbQuery = this.table.select("*", { count: "exact" });

    if (query.category_id) {
      dbQuery = dbQuery.eq("category_id", query.category_id);
    }
    if (query.brand) {
      dbQuery = dbQuery.eq("brand", query.brand);
    }
    if (query.is_active !== undefined) {
      dbQuery = dbQuery.eq("is_active", query.is_active);
    }
    if (query.min_price !== undefined) {
      dbQuery = dbQuery.gte("price", query.min_price);
    }
    if (query.max_price !== undefined) {
      dbQuery = dbQuery.lte("price", query.max_price);
    }
    if (query.search) {
      dbQuery = dbQuery.ilike("name", `%${query.search}%`);
    }

    dbQuery = dbQuery.order(sort, { ascending: order === "asc" });
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw new Error(`Failed to query products: ${error.message}`);
    }

    return { data: (data as Product[]) ?? [], count: count ?? 0 };
  }

  public async findByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    return (data as Product[]) ?? [];
  }

  public async findBySku(sku: string): Promise<Product | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("sku", sku)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find product by SKU: ${error.message}`);
    }

    return data as Product;
  }

  public async findRelated(
    productId: string,
    categoryId: string,
    limit = 10
  ): Promise<Product[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", productId)
      .eq("is_active", true)
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }

    return (data as Product[]) ?? [];
  }

  public async updateStock(id: string, quantity: number): Promise<void> {
    const { error } = await this.db.rpc("update_product_stock", {
      product_id: id,
      quantity_change: quantity,
    });

    if (error) {
      throw new Error(`Failed to update stock: ${error.message}`);
    }
  }
}
