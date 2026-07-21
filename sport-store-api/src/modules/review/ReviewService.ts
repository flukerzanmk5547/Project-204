import { HttpException } from "../../shared/HttpException.js";
import { ReviewRepository } from "./ReviewRepository.js";
import type { ReviewEntity, ReviewSummary } from "./ReviewSchema.js";

export class ReviewService {
  private readonly repository: ReviewRepository;

  constructor() {
    this.repository = new ReviewRepository();
  }

  public async getByProduct(
    productId: string,
    page = 1,
    limit = 20
  ): Promise<{ data: ReviewEntity[]; count: number; summary: ReviewSummary }> {
    const [result, summary] = await Promise.all([
      this.repository.findByProduct(productId, page, limit),
      this.getSummary(productId),
    ]);
    return { ...result, summary };
  }

  public async getSummary(productId: string): Promise<ReviewSummary> {
    const ratings = await this.repository.findRatings(productId);
    const total = ratings.length;

    const breakdown: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };
    for (const r of ratings) {
      const key = String(r);
      if (breakdown[key] !== undefined) breakdown[key] += 1;
    }

    const average =
      total === 0
        ? 0
        : Math.round((ratings.reduce((a, b) => a + b, 0) / total) * 10) / 10;

    return { average, total, breakdown };
  }

  public async create(
    userId: string,
    authorName: string | null,
    dto: {
      product_id: string;
      rating: number;
      title?: string;
      comment?: string;
    }
  ): Promise<ReviewEntity> {
    const review = await this.repository.upsert({
      user_id: userId,
      product_id: dto.product_id,
      rating: dto.rating,
      title: dto.title ?? null,
      comment: dto.comment ?? null,
      author_name: authorName,
    });

    await this.refreshProductRating(dto.product_id);
    return review;
  }

  public async update(
    userId: string,
    reviewId: string,
    dto: { rating?: number; title?: string; comment?: string }
  ): Promise<ReviewEntity> {
    const existing = await this.repository.findById(reviewId);
    if (!existing) throw HttpException.notFound("ไม่พบรีวิวนี้");
    if (existing.user_id !== userId) {
      throw HttpException.forbidden("แก้ไขได้เฉพาะรีวิวของตัวเองเท่านั้น");
    }

    const updated = await this.repository.update(reviewId, dto);
    await this.refreshProductRating(existing.product_id);
    return updated;
  }

  public async remove(userId: string, reviewId: string): Promise<void> {
    const existing = await this.repository.findById(reviewId);
    if (!existing) throw HttpException.notFound("ไม่พบรีวิวนี้");
    if (existing.user_id !== userId) {
      throw HttpException.forbidden("ลบได้เฉพาะรีวิวของตัวเองเท่านั้น");
    }

    await this.repository.remove(reviewId);
    await this.refreshProductRating(existing.product_id);
  }

  public async getMyReview(
    userId: string,
    productId: string
  ): Promise<ReviewEntity | null> {
    return this.repository.findOne(userId, productId);
  }

  /** คำนวณค่าเฉลี่ยใหม่แล้วเขียนกลับไปที่ตาราง products */
  private async refreshProductRating(productId: string): Promise<void> {
    const { average, total } = await this.getSummary(productId);
    await this.repository.syncProductRating(productId, average, total);
  }
}
