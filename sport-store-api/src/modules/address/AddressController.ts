import type { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../../shared/BaseController.js";
import { HttpException } from "../../shared/HttpException.js";
import { AddressService } from "./AddressService.js";
import { AddressSchema } from "./AddressSchema.js";

interface AuthRequest extends FastifyRequest {
  user: { id: string };
}

export class AddressController extends BaseController {
  private readonly service: AddressService;

  constructor() {
    super();
    this.service = new AddressService();
  }

  public async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const addresses = await this.service.getAll(userId);
    this.sendSuccess(reply, addresses);
  }

  public async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { id } = request.params as { id: string };
    const address = await this.service.getById(userId, id);
    this.sendSuccess(reply, address);
  }

  public async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const parsed = AddressSchema.create.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const address = await this.service.create(userId, parsed.data);
    this.sendCreated(reply, address);
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { id } = request.params as { id: string };
    const parsed = AddressSchema.update.safeParse(request.body);
    if (!parsed.success) {
      throw HttpException.badRequest(parsed.error.errors[0].message);
    }
    const address = await this.service.update(userId, id, parsed.data);
    this.sendSuccess(reply, address);
  }

  public async remove(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const userId = (request as AuthRequest).user.id;
    const { id } = request.params as { id: string };
    await this.service.remove(userId, id);
    this.sendNoContent(reply);
  }
}
