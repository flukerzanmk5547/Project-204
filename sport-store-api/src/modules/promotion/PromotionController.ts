import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { PromotionService } from "./PromotionService.js";
import { PromotionSchema } from "./PromotionSchema.js";

export class PromotionController extends BaseController {
  private readonly service: PromotionService;

  constructor() {
    super();
    this.service = new PromotionService();
  }

  public async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { active } = request.query as { active?: string };
    const promos = await this.service.getAll(active === "true");
    this.sendSuccess(reply, promos);
  }

  public async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = PromotionSchema.params.parse(request.params as Record<string, string>);
    const promo = await this.service.getById(id);
    this.sendSuccess(reply, promo);
  }

  public async getBySlug(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { slug } = request.params as { slug: string };
    const promo = await this.service.getBySlug(slug);
    this.sendSuccess(reply, promo);
  }

  public async getActiveDeals(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const deals = await this.service.getActiveDeals();
    this.sendSuccess(reply, deals);
  }

  public async getProducts(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = PromotionSchema.params.parse(request.params as Record<string, string>);
    const products = await this.service.getPromotionProducts(id);
    this.sendSuccess(reply, products);
  }

  public async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = PromotionSchema.create.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const promo = await this.service.create(parsed.data);
    this.sendCreated(reply, promo);
  }

  public async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = PromotionSchema.params.parse(request.params as Record<string, string>);
    const parsed = PromotionSchema.update.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const promo = await this.service.update(id, parsed.data);
    this.sendSuccess(reply, promo);
  }

  public async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = PromotionSchema.params.parse(request.params as Record<string, string>);
    await this.service.delete(id);
    this.sendNoContent(reply);
  }

  public async addProduct(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = PromotionSchema.addProduct.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const product = await this.service.addProduct(parsed.data);
    this.sendCreated(reply, product);
  }

  public async updateProduct(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = PromotionSchema.params.parse(request.params as Record<string, string>);
    const parsed = PromotionSchema.updateProduct.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const product = await this.service.updateProduct(id, parsed.data);
    this.sendSuccess(reply, product);
  }

  public async removeProduct(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { promotionId, productId } = request.params as { promotionId: string; productId: string };
    await this.service.removeProduct(promotionId, productId);
    this.sendNoContent(reply);
  }
}
