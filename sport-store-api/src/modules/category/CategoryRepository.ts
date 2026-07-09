import { BaseRepository } from "../../shared/BaseRepository.js";
import type { Category } from "./CategorySchema.js";

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super("categories");
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find category by slug: ${error.message}`);
    }

    return data as Category;
  }

  public async findByRoutePath(routePath: string): Promise<Category | null> {
    const { data, error } = await this.table
      .select("*")
      .eq("route_path", routePath)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find category by route: ${error.message}`);
    }

    return data as Category;
  }

  public async findRootCategories(): Promise<Category[]> {
    const { data, error } = await this.table
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch root categories: ${error.message}`);
    return (data as Category[]) ?? [];
  }

  public async findChildren(parentId: string): Promise<Category[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("parent_id", parentId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch child categories: ${error.message}`);
    return (data as Category[]) ?? [];
  }

  public async findWithChildren(): Promise<Category[]> {
    const { data, error } = await this.table
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch categories tree: ${error.message}`);
    return (data as Category[]) ?? [];
  }

  public async findAncestors(category: Category): Promise<Category[]> {
    const ancestors: Category[] = [];
    let current: Category | null = category;

    while (current?.parent_id) {
      const parent = await this.findById(current.parent_id);
      if (!parent) break;
      ancestors.unshift(parent);
      current = parent;
    }

    return ancestors;
  }
}
