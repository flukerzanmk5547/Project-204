import { Database } from "../../config/Database.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HttpException } from "../../shared/HttpException.js";
import type {
  CreateSectionDto,
  UpdateSectionDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
  CreateShortcutDto,
  UpdateShortcutDto,
  UpdateConfigDto,
} from "./HomepageSchema.js";

interface HomepageSection {
  id: string;
  title: string;
  slug: string;
  type: string;
  category_id: string | null;
  sort_order: number;
  banners: unknown[];
  sub_categories: unknown[];
  products: unknown[];
}

interface SiteConfigEntry {
  key: string;
  value: string;
  type: string;
}

export class HomepageService {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getAdminClient();
  }

  public async getSections(): Promise<HomepageSection[]> {
    const { data: sections, error } = await this.db
      .from("homepage_sections")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch sections: ${error.message}`);

    const result: HomepageSection[] = [];

    for (const section of sections ?? []) {
      const [banners, subCategories, products] = await Promise.all([
        this.getSectionBanners(section.slug),
        this.getSectionSubCategories(section.id),
        this.getSectionProducts(section.id),
      ]);

      result.push({
        ...section,
        banners,
        sub_categories: subCategories,
        products,
      });
    }

    return result;
  }

  private async getSectionBanners(sectionKey: string): Promise<unknown[]> {
    const { data, error } = await this.db
      .from("banners")
      .select("*")
      .eq("section_key", sectionKey.replace("-products", "").replace("-health", ""))
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data ?? [];
  }

  private async getSectionSubCategories(sectionId: string): Promise<unknown[]> {
    const { data, error } = await this.db
      .from("sub_category_items")
      .select("*")
      .eq("section_id", sectionId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return data ?? [];
  }

  private async getSectionProducts(sectionId: string): Promise<unknown[]> {
    const { data, error } = await this.db
      .from("homepage_section_products")
      .select("sort_order, product:products(*)")
      .eq("section_id", sectionId)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return (data ?? []).map((item: Record<string, unknown>) => item.product);
  }

  public async getCategoryShortcuts(): Promise<unknown[]> {
    const { data, error } = await this.db
      .from("category_shortcuts")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch shortcuts: ${error.message}`);
    return data ?? [];
  }

  public async getConfig(key: string): Promise<string | null> {
    const { data, error } = await this.db
      .from("site_config")
      .select("value")
      .eq("key", key)
      .single();

    if (error) return null;
    return (data as SiteConfigEntry)?.value ?? null;
  }

  public async getAllConfig(): Promise<Record<string, string>> {
    const { data, error } = await this.db
      .from("site_config")
      .select("key, value");

    if (error) return {};

    const config: Record<string, string> = {};
    for (const item of (data as SiteConfigEntry[]) ?? []) {
      config[item.key] = item.value;
    }
    return config;
  }

  // ============================================
  // ADMIN — Homepage Sections CRUD
  // ============================================

  public async getAllSections(): Promise<unknown[]> {
    const { data, error } = await this.db
      .from("homepage_sections")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch sections: ${error.message}`);
    return data ?? [];
  }

  public async createSection(dto: CreateSectionDto): Promise<unknown> {
    const { data, error } = await this.db
      .from("homepage_sections")
      .insert(dto)
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    return data;
  }

  public async updateSection(
    id: string,
    dto: UpdateSectionDto
  ): Promise<unknown> {
    const { data, error } = await this.db
      .from("homepage_sections")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    if (!data) throw HttpException.notFound("ไม่พบ section นี้");
    return data;
  }

  public async deleteSection(id: string): Promise<void> {
    const { error } = await this.db
      .from("homepage_sections")
      .delete()
      .eq("id", id);

    if (error) throw HttpException.badRequest(error.message);
  }

  // ============================================
  // ADMIN — Sub Category Items CRUD
  // ============================================

  public async createSubCategory(dto: CreateSubCategoryDto): Promise<unknown> {
    const { data, error } = await this.db
      .from("sub_category_items")
      .insert(dto)
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    return data;
  }

  public async updateSubCategory(
    id: string,
    dto: UpdateSubCategoryDto
  ): Promise<unknown> {
    const { data, error } = await this.db
      .from("sub_category_items")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    if (!data) throw HttpException.notFound("ไม่พบ sub-category นี้");
    return data;
  }

  public async deleteSubCategory(id: string): Promise<void> {
    const { error } = await this.db
      .from("sub_category_items")
      .delete()
      .eq("id", id);

    if (error) throw HttpException.badRequest(error.message);
  }

  // ============================================
  // ADMIN — Section ↔ Product mapping
  // ============================================

  public async addProductToSection(
    sectionId: string,
    productId: string,
    sortOrder: number
  ): Promise<unknown> {
    const { data, error } = await this.db
      .from("homepage_section_products")
      .insert({
        section_id: sectionId,
        product_id: productId,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    return data;
  }

  public async addProductsToSection(
    sectionId: string,
    products: { product_id: string; sort_order: number }[]
  ): Promise<void> {
    const rows = products.map((p) => ({
      section_id: sectionId,
      product_id: p.product_id,
      sort_order: p.sort_order,
    }));

    const { error } = await this.db
      .from("homepage_section_products")
      .insert(rows);

    if (error) throw HttpException.badRequest(error.message);
  }

  public async removeProductFromSection(
    sectionId: string,
    productId: string
  ): Promise<void> {
    const { error } = await this.db
      .from("homepage_section_products")
      .delete()
      .eq("section_id", sectionId)
      .eq("product_id", productId);

    if (error) throw HttpException.badRequest(error.message);
  }

  // ============================================
  // ADMIN — Category Shortcuts CRUD
  // ============================================

  public async getAllShortcuts(): Promise<unknown[]> {
    const { data, error } = await this.db
      .from("category_shortcuts")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch shortcuts: ${error.message}`);
    return data ?? [];
  }

  public async createShortcut(dto: CreateShortcutDto): Promise<unknown> {
    const { data, error } = await this.db
      .from("category_shortcuts")
      .insert(dto)
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    return data;
  }

  public async updateShortcut(
    id: string,
    dto: UpdateShortcutDto
  ): Promise<unknown> {
    const { data, error } = await this.db
      .from("category_shortcuts")
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    if (!data) throw HttpException.notFound("ไม่พบ shortcut นี้");
    return data;
  }

  public async deleteShortcut(id: string): Promise<void> {
    const { error } = await this.db
      .from("category_shortcuts")
      .delete()
      .eq("id", id);

    if (error) throw HttpException.badRequest(error.message);
  }

  // ============================================
  // ADMIN — Site Config CRUD
  // ============================================

  public async updateConfig(
    key: string,
    dto: UpdateConfigDto
  ): Promise<unknown> {
    const { data, error } = await this.db
      .from("site_config")
      .upsert({ key, ...dto }, { onConflict: "key" })
      .select()
      .single();

    if (error) throw HttpException.badRequest(error.message);
    return data;
  }

  public async deleteConfig(key: string): Promise<void> {
    const { error } = await this.db
      .from("site_config")
      .delete()
      .eq("key", key);

    if (error) throw HttpException.badRequest(error.message);
  }
}
