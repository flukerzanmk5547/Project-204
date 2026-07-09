import type { FastifyInstance, FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { HttpException } from "../shared/HttpException.js";
import type { ApiResponse } from "../shared/types/index.js";

export class ErrorHandler {
  public static register(app: FastifyInstance): void {
    app.setErrorHandler(
      (error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
        const response: ApiResponse = { success: false };

        if (error instanceof HttpException) {
          response.error = error.error;
          response.message = error.message;
          reply.status(error.statusCode).send(response);
          return;
        }

        if (error.validation) {
          response.error = "Validation Error";
          response.message = error.message;
          reply.status(400).send(response);
          return;
        }

        app.log.error(error);

        response.error = "Internal Server Error";
        response.message =
          process.env.NODE_ENV === "development"
            ? error.message
            : "เกิดข้อผิดพลาดภายในระบบ";

        reply.status(error.statusCode ?? 500).send(response);
      }
    );

    app.setNotFoundHandler((_request: FastifyRequest, reply: FastifyReply) => {
      const response: ApiResponse = {
        success: false,
        error: "Not Found",
        message: "ไม่พบ endpoint ที่ร้องขอ",
      };
      reply.status(404).send(response);
    });
  }
}
