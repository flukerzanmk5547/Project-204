import { HttpException } from "../../shared/HttpException.js";
import { Environment } from "../../config/Environment.js";
import { OrderRepository } from "./OrderRepository.js";
import { NotificationService } from "../notification/NotificationService.js";
import type {
  OrderEntity,
  OrderItemEntity,
  CreateOrderDto,
} from "./OrderSchema.js";

export class OrderService {
  private readonly repository: OrderRepository;
  private readonly notificationService: NotificationService;

  constructor() {
    this.repository = new OrderRepository();
    this.notificationService = new NotificationService();
  }

  private generateOrderNumber(): string {
    const now = new Date();
    const y = now.getFullYear().toString().slice(-2);
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SPG-${y}${m}${d}-${rand}`;
  }

  public async create(
    userId: string | null,
    dto: CreateOrderDto
  ): Promise<OrderEntity & { items: OrderItemEntity[] }> {
    const subtotal = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discountTotal = dto.items.reduce((sum, item) => {
      if (item.original_price && item.original_price > item.price) {
        return sum + (item.original_price - item.price) * item.quantity;
      }
      return sum;
    }, 0);
    const shippingCost = subtotal >= 1500 ? 0 : 49;
    const total = subtotal + shippingCost;

    const env = Environment.getInstance();

    const order: Partial<OrderEntity> = {
      user_id: userId,
      order_number: this.generateOrderNumber(),
      status: "pending",
      shipping_name: dto.shipping_name,
      shipping_phone: dto.shipping_phone,
      shipping_address: dto.shipping_address,
      shipping_province: dto.shipping_province,
      shipping_amphoe: dto.shipping_amphoe,
      shipping_district: dto.shipping_district ?? null,
      shipping_postal_code: dto.shipping_postal_code,
      shipping_note: dto.shipping_note ?? null,
      payment_method: dto.payment_method,
      subtotal,
      discount_total: discountTotal,
      shipping_cost: shippingCost,
      total,
      is_test: env.isUAT,
    };

    if (env.isUAT) {
      console.log(
        `[UAT] Order created: ${order.order_number} (is_test=true, stock not deducted)`
      );
    }

    const items: Partial<OrderItemEntity>[] = dto.items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id ?? null,
      name: item.name,
      image: item.image ?? null,
      brand: item.brand ?? null,
      size: item.size ?? null,
      price: item.price,
      original_price: item.original_price ?? null,
      quantity: item.quantity,
    }));

    const created = await this.repository.createWithItems(order, items);

    // แจ้งเตือนพนักงาน (reseller/manager) ว่ามีออเดอร์ใหม่จากลูกค้า
    const itemCount = items.reduce((sum, it) => sum + (it.quantity ?? 0), 0);
    await this.notificationService.notifyNewOrder({
      id: created.id,
      order_number: created.order_number,
      shipping_name: created.shipping_name,
      total: created.total,
      item_count: itemCount,
    });

    return {
      ...created,
      items: items.map((item, i) => ({
        ...(item as OrderItemEntity),
        id: `generated-${i}`,
        order_id: created.id,
        created_at: created.created_at,
      })),
    };
  }

  public async getHistory(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: OrderEntity[]; count: number }> {
    return this.repository.findByUserId(userId, page, limit);
  }

  public async getDetail(
    userId: string,
    orderId: string
  ): Promise<OrderEntity & { items: OrderItemEntity[] }> {
    const order = await this.repository.findWithItems(orderId);
    if (!order) {
      throw HttpException.notFound("ไม่พบคำสั่งซื้อ");
    }
    if (order.user_id && order.user_id !== userId) {
      throw HttpException.forbidden("ไม่มีสิทธิ์เข้าถึงคำสั่งซื้อนี้");
    }
    return order;
  }

  public async updateStatus(
    orderId: string,
    status: string
  ): Promise<OrderEntity> {
    const valid = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!valid.includes(status)) {
      throw HttpException.badRequest(`สถานะไม่ถูกต้อง: ${status}`);
    }
    return this.repository.update(orderId, {
      status,
    } as Partial<OrderEntity>);
  }
}
