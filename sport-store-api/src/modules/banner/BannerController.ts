import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { BannerService } from "./BannerService.js";
import { BannerSchema } from "./BannerSchema.js";

export class BannerController extends BaseController {
  private readonly service: BannerService;

  constructor() {
    super();
    this.service = new BannerService();
  }

  public async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = BannerSchema.query.safeParse(request.query);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const banners = await this.service.getBanners(parsed.data);
    this.sendSuccess(reply, banners);
  }

  public async getById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = BannerSchema.params.parse(request.params as Record<string, string>);
    const banner = await this.service.getById(id);
    this.sendSuccess(reply, banner);
  }

  public async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const parsed = BannerSchema.create.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const banner = await this.service.createBanner(parsed.data);
    this.sendCreated(reply, banner);
  }

  public async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = BannerSchema.params.parse(request.params as Record<string, string>);
    const parsed = BannerSchema.update.safeParse(request.body);
    if (!parsed.success) throw HttpException.badRequest(parsed.error.errors[0].message);
    const banner = await this.service.updateBanner(id, parsed.data);
    this.sendSuccess(reply, banner);
  }

  public async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = BannerSchema.params.parse(request.params as Record<string, string>);
    await this.service.deleteBanner(id);
    this.sendNoContent(reply);
  }
}
