import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

/**
 * จำกัดจำนวน request ต่อ IP เพื่อกันการยิงถล่ม (เช่น brute force รหัสผ่าน
 * หรือช่วงที่มีผู้ใช้จำนวนมากพร้อมกัน)
 *
 * ค่าเริ่มต้น 300 ครั้ง/นาที ตั้งไว้ค่อนข้างหลวมเพราะหน้าแรกหน้าเดียว
 * ยิงหลาย endpoint พร้อมกัน (banners, sections, shortcuts, config)
 * ปรับได้ผ่าน env: RATE_LIMIT_MAX, RATE_LIMIT_WINDOW
 */
export class RateLimitPlugin {
  public static async register(app: FastifyInstance): Promise<void> {
    const max = Number(process.env.RATE_LIMIT_MAX ?? 300);
    const timeWindow = process.env.RATE_LIMIT_WINDOW ?? "1 minute";

    await app.register(rateLimit, {
      max,
      timeWindow,
      // ไม่จำกัด health check เพราะ monitoring ต้องเรียกถี่
      allowList: (request) => request.url === "/api/health",
      errorResponseBuilder: (_request, context) => ({
        success: false,
        message: `ส่งคำขอถี่เกินไป กรุณาลองใหม่ในอีก ${context.after}`,
      }),
    });
  }
}
