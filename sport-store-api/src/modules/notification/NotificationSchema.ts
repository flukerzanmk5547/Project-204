import { z } from "zod";

export class NotificationSchema {
  public static readonly params = z.object({
    id: z.string().uuid(),
  });

  public static readonly query = z.object({
    limit: z.coerce.number().int().positive().max(100).optional().default(30),
    unread_only: z
      .union([z.literal("true"), z.literal("false"), z.boolean()])
      .optional()
      .transform((v) => v === true || v === "true"),
  });
}

export type NotificationType =
  | "order"
  | "payment"
  | "stock"
  | "user"
  | "system";

export interface NotificationEntity {
  id: string;
  type: NotificationType;
  title: string;
  detail: string | null;
  audience: "staff" | "customer";
  order_id: string | null;
  actor_name: string | null;
  amount: number | null;
  link: string | null;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type QueryDto = z.infer<typeof NotificationSchema.query>;
