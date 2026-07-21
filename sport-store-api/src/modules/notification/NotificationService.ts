import { NotificationRepository } from "./NotificationRepository.js";
import type { NotificationEntity, QueryDto } from "./NotificationSchema.js";

interface NewOrderInput {
  id: string;
  order_number: string;
  shipping_name: string;
  total: number;
  item_count: number;
}

export class NotificationService {
  private readonly repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  public async list(
    query: QueryDto
  ): Promise<{ data: NotificationEntity[]; unread_count: number }> {
    const [data, unread_count] = await Promise.all([
      this.repository.findFeed("staff", query.limit, query.unread_only),
      this.repository.countUnread("staff"),
    ]);
    return { data, unread_count };
  }

  public async getUnreadCount(): Promise<{ unread_count: number }> {
    const unread_count = await this.repository.countUnread("staff");
    return { unread_count };
  }

  public async markRead(id: string): Promise<NotificationEntity> {
    return this.repository.update(id, { is_read: true });
  }

  public async markAllRead(): Promise<void> {
    await this.repository.markAllRead("staff");
  }

  /**
   * สร้างการแจ้งเตือนสำหรับพนักงาน (reseller/manager) เมื่อมีออเดอร์ใหม่
   * เรียกจาก OrderService — ห่อ try/catch เพื่อไม่ให้กระทบการสร้างออเดอร์
   */
  public async notifyNewOrder(order: NewOrderInput): Promise<void> {
    try {
      await this.repository.create({
        type: "order",
        title: `คำสั่งซื้อใหม่ ${order.order_number}`,
        detail: `${order.shipping_name} · ${order.item_count} ชิ้น · ฿${order.total.toLocaleString(
          "th-TH"
        )}`,
        audience: "staff",
        order_id: order.id,
        actor_name: order.shipping_name,
        amount: order.total,
        link: `/backoffice/orders`,
        is_read: false,
      });
    } catch (err) {
      console.error("[NotificationService] notifyNewOrder failed:", err);
    }
  }
}
