import { BaseRepository } from "../../shared/BaseRepository.js";
import type { AddressEntity } from "./AddressSchema.js";

export class AddressRepository extends BaseRepository<AddressEntity> {
  constructor() {
    super("user_addresses");
  }

  public async findByUserId(userId: string): Promise<AddressEntity[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch addresses: ${error.message}`);
    return (data as AddressEntity[]) ?? [];
  }

  public async clearDefault(userId: string): Promise<void> {
    const { error } = await this.table
      .update({ is_default: false })
      .eq("user_id", userId)
      .eq("is_default", true);

    if (error) throw new Error(`Failed to clear default: ${error.message}`);
  }
}
