import { BaseRepository } from "../../shared/BaseRepository.js";
import { Database } from "../../config/Database.js";
import type { OrderEntity, OrderItemEntity } from "./OrderSchema.js";

export class OrderRepository extends BaseRepository<OrderEntity> {
  constructor() {
    super("orders");
  }

  public async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: OrderEntity[]; count: number }> {
    const offset = (page - 1) * limit;
    const { data, error, count } = await this.table
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
    return { data: (data as OrderEntity[]) ?? [], count: count ?? 0 };
  }

  public async createWithItems(
    order: Partial<OrderEntity>,
    items: Partial<OrderItemEntity>[]
  ): Promise<OrderEntity> {
    const { data: orderData, error: orderError } = await this.table
      .insert(order as Record<string, unknown>)
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    const createdOrder = orderData as OrderEntity;

    const itemsWithOrderId = items.map((item) => ({
      ...item,
      order_id: createdOrder.id,
    }));

    const { error: itemsError } = await this.db
      .from("order_items")
      .insert(itemsWithOrderId as Record<string, unknown>[]);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    return createdOrder;
  }

  public async findWithItems(
    orderId: string
  ): Promise<(OrderEntity & { items: OrderItemEntity[] }) | null> {
    const { data: order, error } = await this.table
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    const { data: items, error: itemsError } = await this.db
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsError) {
      throw new Error(`Failed to fetch order items: ${itemsError.message}`);
    }

    return {
      ...(order as OrderEntity),
      items: (items as OrderItemEntity[]) ?? [],
    };
  }
}
