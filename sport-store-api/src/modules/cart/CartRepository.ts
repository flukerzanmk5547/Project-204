import { BaseRepository } from "../../shared/BaseRepository.js";
import type { CartItem, CartItemWithProduct } from "./CartSchema.js";

export class CartRepository extends BaseRepository<CartItem> {
  constructor() {
    super("cart_items");
  }

  public async findByUser(userId: string): Promise<CartItemWithProduct[]> {
    const { data, error } = await this.table
      .select(
        `
        *,
        product:products (
          id, name, price, original_price, images, brand, stock
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch cart items: ${error.message}`);
    }

    return (data as CartItemWithProduct[]) ?? [];
  }

  public async findExistingItem(
    userId: string,
    productId: string,
    size?: string,
    color?: string
  ): Promise<CartItem | null> {
    let query = this.table
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (size) {
      query = query.eq("size", size);
    } else {
      query = query.is("size", null);
    }

    if (color) {
      query = query.eq("color", color);
    } else {
      query = query.is("color", null);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`Failed to find cart item: ${error.message}`);
    }

    return data as CartItem | null;
  }

  public async clearCart(userId: string): Promise<void> {
    const { error } = await this.table.delete().eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  public async countItems(userId: string): Promise<number> {
    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to count cart items: ${error.message}`);
    }

    return count ?? 0;
  }
}
