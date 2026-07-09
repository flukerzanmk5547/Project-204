import type { FastifyReply } from "fastify";
import type { ApiResponse } from "./types/index.js";

export abstract class BaseController {
  protected sendSuccess<T>(
    reply: FastifyReply,
    data: T,
    statusCode = 200
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };
    reply.status(statusCode).send(response);
  }

  protected sendCreated<T>(reply: FastifyReply, data: T): void {
    this.sendSuccess(reply, data, 201);
  }

  protected sendNoContent(reply: FastifyReply): void {
    reply.status(204).send();
  }

  protected sendMessage(
    reply: FastifyReply,
    message: string,
    statusCode = 200
  ): void {
    const response: ApiResponse = {
      success: true,
      message,
    };
    reply.status(statusCode).send(response);
  }
}
