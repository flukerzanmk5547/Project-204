import { BaseRepository } from "../../shared/BaseRepository.js";
import type { UserProfile } from "./AuthSchema.js";

export class AuthRepository extends BaseRepository<UserProfile> {
  constructor() {
    super("profiles");
  }

  public async findByEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find profile by email: ${error.message}`);
    }

    return data as UserProfile;
  }

  public async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await this.table
      .upsert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert profile: ${error.message}`);
    }

    return data as UserProfile;
  }
}
