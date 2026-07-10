import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../config/Database.js";

export abstract class BaseRepository<T> {
  protected readonly tableName: string;
  protected readonly db: SupabaseClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = Database.getInstance().getClient();
  }

  protected get table() {
    return this.db.from(this.tableName);
  }

  public async findAll(options?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
    filters?: Record<string, unknown>;
  }): Promise<{ data: T[]; count: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const sort = options?.sort ?? "created_at";
    const order = options?.order ?? "desc";
    const offset = (page - 1) * limit;

    let query = this.table.select("*", { count: "exact" });

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }

    query = query.order(sort, { ascending: order === "asc" });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }

    return { data: (data as T[]) ?? [], count: count ?? 0 };
  }

  public async findById(id: string): Promise<T | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  public async create(entity: Partial<T>): Promise<T> {
    const { data, error } = await this.table
      .insert(entity as Record<string, unknown>)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  public async update(id: string, entity: Partial<T>): Promise<T> {
    const { data, error } = await this.table
      .update(entity as Record<string, unknown>)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  public async delete(id: string): Promise<void> {
    const { error } = await this.table.delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`);
    }
  }

  public async count(filters?: Record<string, unknown>): Promise<number> {
    let query = this.table.select("*", { count: "exact", head: true });

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`);
    }

    return count ?? 0;
  }
}
