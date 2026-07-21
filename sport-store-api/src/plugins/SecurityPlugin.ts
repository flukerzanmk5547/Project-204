import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";

/**
 * ตั้งค่า HTTP security headers ด้วย @fastify/helmet
 *
 * ปิด contentSecurityPolicy ไว้ เพราะ API ตัวนี้คืนค่าเป็น JSON อย่างเดียว
 * (ไม่ได้เสิร์ฟ HTML) และ CSP ที่เปิดค่า default อาจไปบล็อกรูปสินค้า
 * ที่ frontend ดึงจากโดเมนภายนอก
 */
export class SecurityPlugin {
  public static async register(app: FastifyInstance): Promise<void> {
    await app.register(helmet, {
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    });
  }
}
