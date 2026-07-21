import { HttpException } from "../../shared/HttpException.js";
import { FavoriteRepository } from "./FavoriteRepository.js";
import type { FavoriteWithProduct } from "./FavoriteSchema.js";

export class FavoriteService {
  private readonly repository: FavoriteRepository;

  constructor() {
    this.repository = new FavoriteRepository();
  }

  public async getMyFavorites(
    userId: string,
    page = 1,
    limit = 50
  ): Promise<{ data: FavoriteWithProduct[]; count: number }> {
    return this.repository.findByUser(userId, page, limit);
  }

  public async getMyFavoriteIds(userId: string): Promise<string[]> {
    return this.repository.getProductIds(userId);
  }

  public async toggle(
    userId: string,
    productId: string
  ): Promise<{ favorited: boolean }> {
    const existing = await this.repository.findOne(userId, productId);

    if (existing) {
      await this.repository.remove(userId, productId);
      return { favorited: false };
    }

    await this.repository.add(userId, productId);
    return { favorited: true };
  }

  public async add(userId: string, productId: string): Promise<void> {
    await this.repository.add(userId, productId);
  }

  public async remove(userId: string, productId: string): Promise<void> {
    await this.repository.remove(userId, productId);
  }
}
