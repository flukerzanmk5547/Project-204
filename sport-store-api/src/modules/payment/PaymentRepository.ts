import { BaseRepository } from "../../shared/BaseRepository.js";
import type { PaymentEntity } from "./PaymentSchema.js";

export class PaymentRepository extends BaseRepository<PaymentEntity> {
  constructor() {
    super("payments");
  }

  public async findPendingByRefAmount(
    refAmount: number
  ): Promise<PaymentEntity | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("status", "pending")
      .eq("ref_amount", refAmount)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find payment: ${error.message}`);
    }
    return data as PaymentEntity;
  }

  public async findPendingByOrderId(
    orderId: string
  ): Promise<PaymentEntity | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("order_id", orderId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find payment: ${error.message}`);
    }
    return data as PaymentEntity;
  }

  public async expireOldPayments(): Promise<number> {
    const { data, error } = await this.table
      .update({ status: "expired" } as Record<string, unknown>)
      .eq("status", "pending")
      .lt("expires_at", new Date().toISOString())
      .select("id");

    if (error) {
      throw new Error(`Failed to expire payments: ${error.message}`);
    }
    return data?.length ?? 0;
  }

  public async isRefAmountInUse(refAmount: number): Promise<boolean> {
    const { count, error } = await this.table
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("ref_amount", refAmount)
      .gt("expires_at", new Date().toISOString());

    if (error) return false;
    return (count ?? 0) > 0;
  }
}
