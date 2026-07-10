import { HttpException } from "../../shared/HttpException.js";
import { CartRepository } from "./CartRepository.js";
import type {
  CartItemWithProduct,
  AddCartItemDto,
  UpdateCartItemDto,
} from "./CartSchema.js";

interface CartSummary {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

export class CartService {
  private readonly repository: CartRepository;

  constructor() {
    this.repository = new CartRepository();
  }

  public async getCart(userId: string): Promise<CartSummary> {
    const items = await this.repository.findByUser(userId);

    let subtotal = 0;
    let discount = 0;

    for (const item of items) {
      const price = item.product.price * item.quantity;
      subtotal += price;

      if (item.product.original_price) {
        discount += (item.product.original_price - item.product.price) * item.quantity;
      }
    }

    return {
      items,
      itemCount: items.length,
      subtotal,
      discount,
      total: subtotal,
    };
  }

  public async addItem(
    userId: string,
    dto: AddCartItemDto
  ): Promise<CartItemWithProduct[]> {
    const existing = await this.repository.findExistingItem(
      userId,
      dto.product_id,
      dto.size,
      dto.color
    );

    if (existing) {
      await this.repository.update(existing.id, {
        quantity: existing.quantity + dto.quantity,
      });
    } else {
      await this.repository.create({
        user_id: userId,
        product_id: dto.product_id,
        quantity: dto.quantity,
        size: dto.size ?? null,
        color: dto.color ?? null,
      } as never);
    }

    return this.repository.findByUser(userId);
  }

  public async updateItem(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto
  ): Promise<CartItemWithProduct[]> {
    const item = await this.repository.findById(itemId);
    if (!item || item.user_id !== userId) {
      throw HttpException.notFound("ไม่พบรายการในตะกร้า");
    }

    await this.repository.update(itemId, { quantity: dto.quantity });
    return this.repository.findByUser(userId);
  }

  public async removeItem(
    userId: string,
    itemId: string
  ): Promise<CartItemWithProduct[]> {
    const item = await this.repository.findById(itemId);
    if (!item || item.user_id !== userId) {
      throw HttpException.notFound("ไม่พบรายการในตะกร้า");
    }

    await this.repository.delete(itemId);
    return this.repository.findByUser(userId);
  }

  public async clearCart(userId: string): Promise<void> {
    await this.repository.clearCart(userId);
  }

  public async getItemCount(userId: string): Promise<number> {
    return this.repository.countItems(userId);
  }
}
