import { HttpException } from "../../shared/HttpException.js";
import { PromotionRepository } from "./PromotionRepository.js";
import type { Promotion, PromotionProduct } from "./PromotionSchema.js";

export class PromotionService {
  private readonly repo: PromotionRepository;

  constructor() {
    this.repo = new PromotionRepository();
  }

  public async getAll(activeOnly = false): Promise<Promotion[]> {
    return this.repo.findAll(activeOnly);
  }

  public async getById(id: string): Promise<Promotion> {
    const promo = await this.repo.findById(id);
    if (!promo) throw HttpException.notFound("ไม่พบโปรโมชั่น");
    return promo;
  }

  public async getBySlug(slug: string): Promise<Promotion & { products: PromotionProduct[] }> {
    const promo = await this.repo.findBySlug(slug);
    if (!promo) throw HttpException.notFound("ไม่พบโปรโมชั่น");
    const products = await this.repo.findProductsByPromotion(promo.id);
    return { ...promo, products };
  }

  public async getActiveDeals(): Promise<PromotionProduct[]> {
    return this.repo.findActiveDeals();
  }

  public async getPromotionProducts(id: string): Promise<PromotionProduct[]> {
    await this.getById(id);
    return this.repo.findProductsByPromotion(id);
  }

  public async create(data: Record<string, unknown>): Promise<Promotion> {
    return this.repo.create(data);
  }

  public async update(id: string, data: Record<string, unknown>): Promise<Promotion> {
    await this.getById(id);
    return this.repo.update(id, data);
  }

  public async delete(id: string): Promise<void> {
    await this.getById(id);
    return this.repo.delete(id);
  }

  public async addProduct(data: Record<string, unknown>): Promise<PromotionProduct> {
    return this.repo.addProduct(data);
  }

  public async updateProduct(id: string, data: Record<string, unknown>): Promise<PromotionProduct> {
    return this.repo.updateProduct(id, data);
  }

  public async removeProduct(promotionId: string, productId: string): Promise<void> {
    return this.repo.removeProduct(promotionId, productId);
  }
}
