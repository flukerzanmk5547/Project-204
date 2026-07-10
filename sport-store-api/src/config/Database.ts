import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Environment } from "./Environment.js";

export class Database {
  private static instance: Database;
  private readonly client: SupabaseClient;

  private constructor() {
    const env = Environment.getInstance();
    this.client = createClient(env.supabaseUrl, env.supabaseAnonKey);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client.from("products").select("id").limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}
