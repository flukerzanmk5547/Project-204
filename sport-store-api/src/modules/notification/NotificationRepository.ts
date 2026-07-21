import { BaseRepository } from "../../shared/BaseRepository.js";
import type { NotificationEntity } from "./NotificationSchema.js";

export class NotificationRepository extends BaseRepository<NotificationEntity> {
  constructor() {
    super("notifications");
  }

  public async findFeed(
    audience: string,
    limit: number,
    unreadOnly: boolean
  ): Promise<NotificationEntity[]> {
    let query = this.table
      .select("*")
      .eq("audience", audience)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) query = query.eq("is_read", false);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
    return (data as NotificationEntity[]) ?? [];
  }

  public async countUnread(audience: string): Promise<number> {
    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("audience", audience)
      .eq("is_read", false);

    if (error) {
      throw new Error(`Failed to count notifications: ${error.message}`);
    }
    return count ?? 0;
  }

  public async markAllRead(audience: string): Promise<void> {
    const { error } = await this.table
      .update({ is_read: true })
      .eq("audience", audience)
      .eq("is_read", false);

    if (error) {
      throw new Error(`Failed to mark notifications read: ${error.message}`);
    }
  }
}
