import { BaseService } from "../../shared/BaseService.js";
import { HttpException } from "../../shared/HttpException.js";
import type { PaginatedResponse } from "../../shared/types/index.js";
import { ProductRepository } from "./ProductRepository.js";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from "./ProductSchema.js";

export class ProductService extends BaseService<Product> {
  private readonly productRepo: ProductRepository;

  constructor() {
    const repo = new ProductRepository();
    super(repo);
    this.productRepo = repo;
  }

  public async getAllProducts(
    query: ProductQueryDto
  ): Promise<PaginatedResponse<Product>> {
    const { data, count } = await this.productRepo.findWithFilters(query);

    return {
      data,
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        total: count,
        totalPages: Math.ceil(count / (query.limit ?? 20)),
      },
    };
  }

  public async getProductById(id: string): Promise<Product> {
    return this.getById(id);
  }

  public async getRelatedProducts(
    productId: string,
    limit = 10
  ): Promise<Product[]> {
    const product = await this.getById(productId);
    return this.productRepo.findRelated(productId, product.category_id, limit);
  }

  public async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepo.findByCategory(categoryId);
  }

  public async createProduct(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productRepo.findBySku(dto.sku);
    if (existing) {
      throw HttpException.conflict(`SKU "${dto.sku}" มีอยู่ในระบบแล้ว`);
    }
    return this.create(dto as Partial<Product>);
  }

  public async updateProduct(
    id: string,
    dto: UpdateProductDto
  ): Promise<Product> {
    if (dto.sku) {
      const existing = await this.productRepo.findBySku(dto.sku);
      if (existing && existing.id !== id) {
        throw HttpException.conflict(`SKU "${dto.sku}" ถูกใช้งานแล้ว`);
      }
    }
    return this.update(id, dto as Partial<Product>);
  }

  public async deleteProduct(id: string): Promise<void> {
    return this.remove(id);
  }

  public async adjustStock(id: string, quantity: number): Promise<void> {
    await this.getById(id);
    await this.productRepo.updateStock(id, quantity);
  }
}
