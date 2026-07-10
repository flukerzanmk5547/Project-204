import { BaseRepository } from "./BaseRepository.js";
import { HttpException } from "./HttpException.js";
import type { PaginatedResponse, PaginationQuery } from "./types/index.js";

export abstract class BaseService<T> {
  protected readonly repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  public async getAll(
    query: PaginationQuery,
    filters?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { data, count } = await this.repository.findAll({
      page,
      limit,
      sort: query.sort,
      order: query.order,
      filters,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  public async getById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw HttpException.notFound(`ไม่พบข้อมูลที่มี ID: ${id}`);
    }
    return entity;
  }

  public async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  public async remove(id: string): Promise<void> {
    await this.getById(id);
    return this.repository.delete(id);
  }
}
