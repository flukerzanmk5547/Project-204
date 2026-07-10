import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { AttributeService } from "./AttributeService.js";
import { AttributeSchema } from "./AttributeSchema.js";

export class AttributeController extends BaseController {
  private readonly service: AttributeService;

  constructor() {
    super();
    this.service = new AttributeService();
  }

  // ---- Groups ----

  public async getAllGroups(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const groups = await this.service.getAllGroups();
    this.sendSuccess(reply, groups);
  }

  public async getGroupById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const group = await this.service.getGroupById(id);
    this.sendSuccess(reply, group);
  }

  public async createGroup(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = AttributeSchema.createGroup.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const group = await this.service.createGroup(parsed.data);
    this.sendCreated(reply, group);
  }

  public async updateGroup(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const parsed = AttributeSchema.updateGroup.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const group = await this.service.updateGroup(id, parsed.data);
    this.sendSuccess(reply, group);
  }

  public async deleteGroup(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    await this.service.deleteGroup(id);
    this.sendNoContent(reply);
  }

  // ---- Options ----

  public async getOptions(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const options = await this.service.getOptionsByGroup(id);
    this.sendSuccess(reply, options);
  }

  public async createOption(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = AttributeSchema.createOption.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const option = await this.service.createOption(parsed.data);
    this.sendCreated(reply, option);
  }

  public async updateOption(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const parsed = AttributeSchema.updateOption.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const option = await this.service.updateOption(id, parsed.data);
    this.sendSuccess(reply, option);
  }

  public async deleteOption(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    await this.service.deleteOption(id);
    this.sendNoContent(reply);
  }

  // ---- Category Attributes ----

  public async getCategoryAttributes(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const attrs = await this.service.getCategoryAttributes(id);
    this.sendSuccess(reply, attrs);
  }

  public async linkCategoryAttribute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = AttributeSchema.linkCategory.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    await this.service.linkCategoryAttribute(parsed.data.category_id, parsed.data.group_id, parsed.data.is_required, parsed.data.sort_order);
    this.sendMessage(reply, "เชื่อม attribute กับ category สำเร็จ", 201);
  }

  public async unlinkCategoryAttribute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { category_id, group_id } = request.body as { category_id: string; group_id: string };
    await this.service.unlinkCategoryAttribute(category_id, group_id);
    this.sendNoContent(reply);
  }

  // ---- Product Variants ----

  public async getVariants(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const variants = await this.service.getVariantsByProduct(id);
    this.sendSuccess(reply, variants);
  }

  public async createVariant(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = AttributeSchema.createVariant.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const variant = await this.service.createVariant(parsed.data);
    this.sendCreated(reply, variant);
  }

  public async updateVariant(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    const parsed = AttributeSchema.updateVariant.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const variant = await this.service.updateVariant(id, parsed.data);
    this.sendSuccess(reply, variant);
  }

  public async deleteVariant(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = AttributeSchema.params.parse(request.params as Record<string, string>);
    await this.service.deleteVariant(id);
    this.sendNoContent(reply);
  }
}
