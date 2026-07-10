import type { FastifyRequest, FastifyReply } from "fastify";

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export type RequestHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<void>;

export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  handler: RequestHandler;
  schema?: Record<string, unknown>;
  preHandler?: RequestHandler[];
}
