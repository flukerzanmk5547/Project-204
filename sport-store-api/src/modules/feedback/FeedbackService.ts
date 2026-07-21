import { FeedbackRepository } from "./FeedbackRepository.js";
import type { FeedbackEntity, FeedbackSummary } from "./FeedbackSchema.js";

export class FeedbackService {
  private readonly repository: FeedbackRepository;

  constructor() {
    this.repository = new FeedbackRepository();
  }

  public async create(
    userId: string | null,
    dto: {
      rating: number;
      purpose?: string;
      achieved?: string;
      comment?: string;
      page_url?: string;
    }
  ): Promise<FeedbackEntity> {
    return this.repository.create({
      user_id: userId,
      rating: dto.rating,
      purpose: dto.purpose ?? null,
      achieved: dto.achieved ?? null,
      comment: dto.comment ?? null,
      page_url: dto.page_url ?? null,
    });
  }

  public async getAll(
    page = 1,
    limit = 50
  ): Promise<{ data: FeedbackEntity[]; count: number }> {
    return this.repository.findAll(page, limit);
  }

  public async getSummary(): Promise<FeedbackSummary> {
    const rows = await this.repository.findForSummary();
    const total = rows.length;

    const breakdown: Record<string, number> = {};
    const byPurpose: Record<string, number> = {};

    for (const r of rows) {
      const key = String(r.rating);
      breakdown[key] = (breakdown[key] ?? 0) + 1;
      if (r.purpose) {
        byPurpose[r.purpose] = (byPurpose[r.purpose] ?? 0) + 1;
      }
    }

    const average =
      total === 0
        ? 0
        : Math.round(
            (rows.reduce((a, b) => a + b.rating, 0) / total) * 10
          ) / 10;

    return { average, total, breakdown, by_purpose: byPurpose };
  }
}
