import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { ProductService } from "./ProductService.js";
import { ProductSchema } from "./ProductSchema.js";

export class ProductController extends BaseController {
  private readonly service: ProductService;

  constructor() {
    super();
    this.service = new ProductService();
  }

  public async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = ProductSchema.query.safeParse(request.query);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const result = await this.service.getAllProducts(parsed.data);
    this.sendSuccess(reply, result);
  }

  public async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = ProductSchema.params.parse(
      request.params as Record<string, string>
    );
    const product = await this.service.getProductById(id);
    this.sendSuccess(reply, product);
  }

  public async getRelated(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = ProductSchema.params.parse(
      request.params as Record<string, string>
    );
    const limit =
      (request.query as Record<string, string>).limit ?? "10";
    const products = await this.service.getRelatedProducts(
      id,
      parseInt(limit, 10)
    );
    this.sendSuccess(reply, products);
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = ProductSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const product = await this.service.createProduct(parsed.data);
    this.sendCreated(reply, product);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = ProductSchema.params.parse(
      request.params as Record<string, string>
    );
    const parsed = ProductSchema.update.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const product = await this.service.updateProduct(id, parsed.data);
    this.sendSuccess(reply, product);
  }

  public async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = ProductSchema.params.parse(
      request.params as Record<string, string>
    );
    await this.service.deleteProduct(id);
    this.sendNoContent(reply);
  }
}
