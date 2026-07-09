import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HomepageService } from "./HomepageService.js";
import { HomepageSchema } from "./HomepageSchema.js";

export class HomepageController extends BaseController {
  private readonly service: HomepageService;

  constructor() {
    super();
    this.service = new HomepageService();
  }

  public async getSections(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const sections = await this.service.getSections();
    this.sendSuccess(reply, sections);
  }

  public async getShortcuts(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const shortcuts = await this.service.getCategoryShortcuts();
    this.sendSuccess(reply, shortcuts);
  }

  public async getConfig(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { key } = request.params as { key: string };

    if (key === "all") {
      const config = await this.service.getAllConfig();
      this.sendSuccess(reply, config);
      return;
    }

    const value = await this.service.getConfig(key);
    this.sendSuccess(reply, { key, value });
  }

  // ============================================
  // ADMIN — Sections
  // ============================================

  public async getAllSections(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const sections = await this.service.getAllSections();
    this.sendSuccess(reply, sections);
  }

  public async createSection(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto = HomepageSchema.createSection.parse(request.body);
    const section = await this.service.createSection(dto);
    this.sendCreated(reply, section);
  }

  public async updateSection(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    const dto = HomepageSchema.updateSection.parse(request.body);
    const section = await this.service.updateSection(id, dto);
    this.sendSuccess(reply, section);
  }

  public async deleteSection(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    await this.service.deleteSection(id);
    this.sendNoContent(reply);
  }

  // ============================================
  // ADMIN — Sub Category Items
  // ============================================

  public async createSubCategory(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto = HomepageSchema.createSubCategory.parse(request.body);
    const item = await this.service.createSubCategory(dto);
    this.sendCreated(reply, item);
  }

  public async updateSubCategory(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    const dto = HomepageSchema.updateSubCategory.parse(request.body);
    const item = await this.service.updateSubCategory(id, dto);
    this.sendSuccess(reply, item);
  }

  public async deleteSubCategory(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    await this.service.deleteSubCategory(id);
    this.sendNoContent(reply);
  }

  // ============================================
  // ADMIN — Section ↔ Product mapping
  // ============================================

  public async addProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    const { product_id, sort_order } = HomepageSchema.addProduct.parse(
      request.body
    );
    const item = await this.service.addProductToSection(
      id,
      product_id,
      sort_order
    );
    this.sendCreated(reply, item);
  }

  public async addProducts(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    const { products } = HomepageSchema.addProducts.parse(request.body);
    await this.service.addProductsToSection(id, products);
    this.sendMessage(reply, "เพิ่มสินค้าเข้า section เรียบร้อย", 201);
  }

  public async removeProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id, productId } = HomepageSchema.sectionProductParams.parse(
      request.params
    );
    await this.service.removeProductFromSection(id, productId);
    this.sendNoContent(reply);
  }

  // ============================================
  // ADMIN — Category Shortcuts
  // ============================================

  public async getAllShortcuts(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const shortcuts = await this.service.getAllShortcuts();
    this.sendSuccess(reply, shortcuts);
  }

  public async createShortcut(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto = HomepageSchema.createShortcut.parse(request.body);
    const shortcut = await this.service.createShortcut(dto);
    this.sendCreated(reply, shortcut);
  }

  public async updateShortcut(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    const dto = HomepageSchema.updateShortcut.parse(request.body);
    const shortcut = await this.service.updateShortcut(id, dto);
    this.sendSuccess(reply, shortcut);
  }

  public async deleteShortcut(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = HomepageSchema.params.parse(request.params);
    await this.service.deleteShortcut(id);
    this.sendNoContent(reply);
  }

  // ============================================
  // ADMIN — Site Config
  // ============================================

  public async updateConfig(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { key } = HomepageSchema.keyParams.parse(request.params);
    const dto = HomepageSchema.updateConfig.parse(request.body);
    const config = await this.service.updateConfig(key, dto);
    this.sendSuccess(reply, config);
  }

  public async deleteConfig(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { key } = HomepageSchema.keyParams.parse(request.params);
    await this.service.deleteConfig(key);
    this.sendNoContent(reply);
  }
}
