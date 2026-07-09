export class HttpException extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  constructor(statusCode: number, message: string, error?: string) {
    super(message);
    this.statusCode = statusCode;
    this.error = error ?? this.getDefaultError(statusCode);
    Object.setPrototypeOf(this, HttpException.prototype);
  }

  private getDefaultError(statusCode: number): string {
    const errors: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Unprocessable Entity",
      429: "Too Many Requests",
      500: "Internal Server Error",
    };
    return errors[statusCode] ?? "Unknown Error";
  }

  public static badRequest(message: string): HttpException {
    return new HttpException(400, message);
  }

  public static unauthorized(message = "กรุณาเข้าสู่ระบบ"): HttpException {
    return new HttpException(401, message);
  }

  public static forbidden(message = "ไม่มีสิทธิ์เข้าถึง"): HttpException {
    return new HttpException(403, message);
  }

  public static notFound(message = "ไม่พบข้อมูล"): HttpException {
    return new HttpException(404, message);
  }

  public static conflict(message: string): HttpException {
    return new HttpException(409, message);
  }

  public static internal(message = "เกิดข้อผิดพลาดภายใน"): HttpException {
    return new HttpException(500, message);
  }
}
