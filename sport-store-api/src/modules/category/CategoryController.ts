import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { CategoryService } from "./CategoryService.js";
import { CategorySchema } from "./CategorySchema.js";

export class CategoryController extends BaseController {
  private readonly service: CategoryService;

  constructor() {
    super();
    this.service = new CategoryService();
  }

  public async getTree(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const tree = await this.service.getCategoryTree();
    this.sendSuccess(reply, tree);
  }

  public async getRoots(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const categories = await this.service.getRootCategories();
    this.sendSuccess(reply, categories);
  }

  public async getChildren(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = CategorySchema.params.parse(
      request.params as Record<string, string>
    );
    const children = await this.service.getChildren(id);
    this.sendSuccess(reply, children);
  }

  public async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = CategorySchema.params.parse(
      request.params as Record<string, string>
    );
    const category = await this.service.getById(id);
    this.sendSuccess(reply, category);
  }

  public async getByRoute(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { "*": routePath } = request.params as { "*": string };
    if (!routePath) {
      throw HttpException.badRequest("กรุณาระบุ route path");
    }
    const fullData = await this.service.getByRoutePath(routePath);
    this.sendSuccess(reply, fullData);
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const parsed = CategorySchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const category = await this.service.createCategory(parsed.data);
    this.sendCreated(reply, category);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = CategorySchema.params.parse(
      request.params as Record<string, string>
    );
    const parsed = CategorySchema.update.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }

    const category = await this.service.updateCategory(id, parsed.data);
    this.sendSuccess(reply, category);
  }

  public async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = CategorySchema.params.parse(
      request.params as Record<string, string>
    );
    await this.service.deleteCategory(id);
    this.sendNoContent(reply);
  }
}
