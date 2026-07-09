import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { BundleService } from "./BundleService.js";
import { BundleSchema } from "./BundleSchema.js";

export class BundleController extends BaseController {
  private readonly service: BundleService;

  constructor() {
    super();
    this.service = new BundleService();
  }

  // --- Public ---

  public async getActiveBundles(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const bundles = await this.service.getActiveBundles();
    this.sendSuccess(reply, bundles);
  }

  public async getBundlesForProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { productId } = request.params as { productId: string };
    const bundles = await this.service.getBundlesForProduct(productId);
    this.sendSuccess(reply, bundles);
  }

  public async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    const bundle = await this.service.getById(id);
    this.sendSuccess(reply, bundle);
  }

  // --- Admin ---

  public async getAll(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const bundles = await this.service.getAll();
    this.sendSuccess(reply, bundles);
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const dto = BundleSchema.create.parse(request.body);
    const bundle = await this.service.create(dto);
    this.sendCreated(reply, bundle);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    const dto = BundleSchema.update.parse(request.body);
    const bundle = await this.service.update(id, dto);
    this.sendSuccess(reply, bundle);
  }

  public async remove(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    await this.service.remove(id);
    this.sendNoContent(reply);
  }

  // --- Bundle Items ---

  public async addItem(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    const { product_id, quantity, sort_order } = BundleSchema.addItem.parse(
      request.body
    );
    await this.service.addItem(id, product_id, quantity, sort_order);
    this.sendMessage(reply, "เพิ่มสินค้าในเซ็ตเรียบร้อย", 201);
  }

  public async addItems(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    const { items } = BundleSchema.addItems.parse(request.body);
    await this.service.addItems(id, items);
    this.sendMessage(reply, "เพิ่มสินค้าในเซ็ตเรียบร้อย", 201);
  }

  public async removeItem(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id, itemId } = BundleSchema.itemParams.parse(request.params);
    await this.service.removeItem(id, itemId);
    this.sendNoContent(reply);
  }

  // --- Product-Bundle Links ---

  public async linkToProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    const { product_id, sort_order } = BundleSchema.linkToProduct.parse(
      request.body
    );
    await this.service.linkToProduct(product_id, id, sort_order);
    this.sendMessage(reply, "เชื่อม bundle กับสินค้าเรียบร้อย", 201);
  }

  public async unlinkFromProduct(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = BundleSchema.params.parse(request.params);
    const { product_id } = request.body as { product_id: string };
    if (!product_id) throw HttpException.badRequest("กรุณาระบุ product_id");
    await this.service.unlinkFromProduct(product_id, id);
    this.sendNoContent(reply);
  }
}
