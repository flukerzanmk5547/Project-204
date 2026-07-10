import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../config/Database.js";
import type {
  AttributeGroup,
  AttributeOption,
  ProductVariant,
  VariantAttributeValue,
} from "./AttributeSchema.js";

export class AttributeRepository {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = Database.getInstance().getClient();
  }

  // ---- Attribute Groups ----

  public async findAllGroups(): Promise<AttributeGroup[]> {
    const { data, error } = await this.db
      .from("attribute_groups")
      .select("*, options:attribute_options(*)")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch groups: ${error.message}`);
    return (data as AttributeGroup[]) ?? [];
  }

  public async findGroupById(id: string): Promise<AttributeGroup | null> {
    const { data, error } = await this.db
      .from("attribute_groups")
      .select("*, options:attribute_options(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to find group: ${error.message}`);
    }
    return data as AttributeGroup;
  }

  public async createGroup(entity: Partial<AttributeGroup>): Promise<AttributeGroup> {
    const { data, error } = await this.db
      .from("attribute_groups")
      .insert(entity as Record<string, unknown>)
      .select()
      .single();
    if (error) throw new Error(`Failed to create group: ${error.message}`);
    return data as AttributeGroup;
  }

  public async updateGroup(id: string, entity: Partial<AttributeGroup>): Promise<AttributeGroup> {
    const { data, error } = await this.db
      .from("attribute_groups")
      .update(entity as Record<string, unknown>)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update group: ${error.message}`);
    return data as AttributeGroup;
  }

  public async deleteGroup(id: string): Promise<void> {
    const { error } = await this.db.from("attribute_groups").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete group: ${error.message}`);
  }

  // ---- Attribute Options ----

  public async findOptionsByGroup(groupId: string): Promise<AttributeOption[]> {
    const { data, error } = await this.db
      .from("attribute_options")
      .select("*")
      .eq("group_id", groupId)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch options: ${error.message}`);
    return (data as AttributeOption[]) ?? [];
  }

  public async createOption(entity: Partial<AttributeOption>): Promise<AttributeOption> {
    const { data, error } = await this.db
      .from("attribute_options")
      .insert(entity as Record<string, unknown>)
      .select()
      .single();
    if (error) throw new Error(`Failed to create option: ${error.message}`);
    return data as AttributeOption;
  }

  public async updateOption(id: string, entity: Partial<AttributeOption>): Promise<AttributeOption> {
    const { data, error } = await this.db
      .from("attribute_options")
      .update(entity as Record<string, unknown>)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update option: ${error.message}`);
    return data as AttributeOption;
  }

  public async deleteOption(id: string): Promise<void> {
    const { error } = await this.db.from("attribute_options").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete option: ${error.message}`);
  }

  // ---- Category ↔ Attribute Groups ----

  public async findGroupsByCategory(categoryId: string): Promise<AttributeGroup[]> {
    const { data, error } = await this.db
      .from("category_attribute_groups")
      .select("sort_order, is_required, group:attribute_groups(*, options:attribute_options(*))")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Failed to fetch category attributes: ${error.message}`);

    return (data ?? []).map((item: Record<string, unknown>) => ({
      ...(item.group as AttributeGroup),
      is_required: item.is_required,
    }));
  }

  public async linkCategoryGroup(categoryId: string, groupId: string, isRequired: boolean, sortOrder: number): Promise<void> {
    const { error } = await this.db
      .from("category_attribute_groups")
      .upsert(
        { category_id: categoryId, group_id: groupId, is_required: isRequired, sort_order: sortOrder },
        { onConflict: "category_id,group_id" }
      );
    if (error) throw new Error(`Failed to link category attribute: ${error.message}`);
  }

  public async unlinkCategoryGroup(categoryId: string, groupId: string): Promise<void> {
    const { error } = await this.db
      .from("category_attribute_groups")
      .delete()
      .eq("category_id", categoryId)
      .eq("group_id", groupId);
    if (error) throw new Error(`Failed to unlink category attribute: ${error.message}`);
  }

  // ---- Product Variants ----

  public async findVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    const { data, error } = await this.db
      .from("product_variants")
      .select("*, attributes:variant_attribute_values(*, group:attribute_groups(*), option:attribute_options(*))")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) throw new Error(`Failed to fetch variants: ${error.message}`);
    return (data as ProductVariant[]) ?? [];
  }

  public async createVariant(entity: Record<string, unknown>): Promise<ProductVariant> {
    const { data, error } = await this.db
      .from("product_variants")
      .insert(entity)
      .select()
      .single();
    if (error) throw new Error(`Failed to create variant: ${error.message}`);
    return data as ProductVariant;
  }

  public async updateVariant(id: string, entity: Record<string, unknown>): Promise<ProductVariant> {
    const { data, error } = await this.db
      .from("product_variants")
      .update(entity)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update variant: ${error.message}`);
    return data as ProductVariant;
  }

  public async deleteVariant(id: string): Promise<void> {
    const { error } = await this.db.from("product_variants").delete().eq("id", id);
    if (error) throw new Error(`Failed to delete variant: ${error.message}`);
  }

  public async createVariantAttributes(values: Record<string, unknown>[]): Promise<void> {
    if (values.length === 0) return;
    const { error } = await this.db
      .from("variant_attribute_values")
      .insert(values);
    if (error) throw new Error(`Failed to create variant attributes: ${error.message}`);
  }

  public async deleteVariantAttributes(variantId: string): Promise<void> {
    const { error } = await this.db
      .from("variant_attribute_values")
      .delete()
      .eq("variant_id", variantId);
    if (error) throw new Error(`Failed to delete variant attributes: ${error.message}`);
  }
}
