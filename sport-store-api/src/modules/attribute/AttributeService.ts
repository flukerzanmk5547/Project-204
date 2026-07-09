import { HttpException } from "../../shared/HttpException.js";
import { AttributeRepository } from "./AttributeRepository.js";
import type {
  AttributeGroup,
  AttributeOption,
  ProductVariant,
} from "./AttributeSchema.js";
import type { z } from "zod";
import type { AttributeSchema } from "./AttributeSchema.js";

type CreateVariantDto = z.infer<typeof AttributeSchema.createVariant>;

export class AttributeService {
  private readonly repo: AttributeRepository;

  constructor() {
    this.repo = new AttributeRepository();
  }

  // ---- Groups ----

  public async getAllGroups(): Promise<AttributeGroup[]> {
    return this.repo.findAllGroups();
  }

  public async getGroupById(id: string): Promise<AttributeGroup> {
    const group = await this.repo.findGroupById(id);
    if (!group) throw HttpException.notFound("ไม่พบ attribute group");
    return group;
  }

  public async createGroup(data: Partial<AttributeGroup>): Promise<AttributeGroup> {
    return this.repo.createGroup(data);
  }

  public async updateGroup(id: string, data: Partial<AttributeGroup>): Promise<AttributeGroup> {
    await this.getGroupById(id);
    return this.repo.updateGroup(id, data);
  }

  public async deleteGroup(id: string): Promise<void> {
    await this.getGroupById(id);
    return this.repo.deleteGroup(id);
  }

  // ---- Options ----

  public async getOptionsByGroup(groupId: string): Promise<AttributeOption[]> {
    return this.repo.findOptionsByGroup(groupId);
  }

  public async createOption(data: Partial<AttributeOption>): Promise<AttributeOption> {
    return this.repo.createOption(data);
  }

  public async updateOption(id: string, data: Partial<AttributeOption>): Promise<AttributeOption> {
    return this.repo.updateOption(id, data);
  }

  public async deleteOption(id: string): Promise<void> {
    return this.repo.deleteOption(id);
  }

  // ---- Category Attributes ----

  public async getCategoryAttributes(categoryId: string): Promise<AttributeGroup[]> {
    return this.repo.findGroupsByCategory(categoryId);
  }

  public async linkCategoryAttribute(
    categoryId: string,
    groupId: string,
    isRequired: boolean,
    sortOrder: number
  ): Promise<void> {
    return this.repo.linkCategoryGroup(categoryId, groupId, isRequired, sortOrder);
  }

  public async unlinkCategoryAttribute(categoryId: string, groupId: string): Promise<void> {
    return this.repo.unlinkCategoryGroup(categoryId, groupId);
  }

  // ---- Variants ----

  public async getVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    return this.repo.findVariantsByProduct(productId);
  }

  public async createVariant(dto: CreateVariantDto): Promise<ProductVariant> {
    const { attributes, ...variantData } = dto;

    const variant = await this.repo.createVariant(variantData);

    if (attributes && attributes.length > 0) {
      const attrValues = attributes.map((attr) => ({
        variant_id: variant.id,
        group_id: attr.group_id,
        option_id: attr.option_id ?? null,
        custom_value: attr.custom_value ?? null,
      }));
      await this.repo.createVariantAttributes(attrValues);
    }

    const variants = await this.repo.findVariantsByProduct(variant.product_id);
    return variants.find((v) => v.id === variant.id) ?? variant;
  }

  public async updateVariant(id: string, data: Record<string, unknown>): Promise<ProductVariant> {
    return this.repo.updateVariant(id, data);
  }

  public async deleteVariant(id: string): Promise<void> {
    await this.repo.deleteVariantAttributes(id);
    return this.repo.deleteVariant(id);
  }
}
