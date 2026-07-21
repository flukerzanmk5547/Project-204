/**
 * สคริปเชื่อมต่อบัญชี LINE กับระบบชำระเงิน
 *
 * วิธีใช้: bun run scripts/line-login.ts
 *
 * ขั้นตอน:
 * 1. สคริปจะแสดง QR Code ในเทอร์มินัล → สแกนด้วยแอป LINE
 * 2. แอป LINE จะแสดงรหัส PIN 6 หลัก → ใส่ในแอป LINE เพื่อยืนยัน
 * 3. เมื่อสำเร็จ auth token + refresh token จะถูกบันทึกลง DB อัตโนมัติ
 */

import { loginWithQR } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import { createClient } from "@supabase/supabase-js";
import qrcodeTerminal from "qrcode-terminal";
import * as dotenv from "dotenv";

dotenv.config();

const ACCOUNT_ID = "a0000001-0000-0000-0000-000000000001";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
  console.log("===========================================");
  console.log("  LINE Login — เชื่อมต่อบัญชีชำระเงิน");
  console.log("===========================================\n");

  const storage = new FileStorage(`./line_storage_${ACCOUNT_ID}.json`);

  console.log("กำลังสร้าง QR Code... (สแกนให้เร็วภายใน 60 วินาที)\n");

  const client = await loginWithQR(
    {
      onReceiveQRUrl(url: string) {
        console.log("╔═══════════════════════════════════════╗");
        console.log("║  สแกน QR Code นี้ด้วยแอป LINE:       ║");
        console.log("╚═══════════════════════════════════════╝\n");

        qrcodeTerminal.generate(url, { small: true }, (qr: string) => {
          console.log(qr);
        });

        console.log(`\nURL: ${url}\n`);
        console.log("→ เปิดแอป LINE → กดที่ตัวอ่าน QR → สแกน QR ด้านบน");
        console.log("→ หรือเปิดลิงก์ URL บนมือถือโดยตรง");
        console.log("→ รอสักครู่...\n");
      },
      onPincodeRequest(pincode: string) {
        console.log("╔═══════════════════════════════════════╗");
        console.log(`║  ใส่รหัสนี้ในแอป LINE:  ${pincode}         ║`);
        console.log("╚═══════════════════════════════════════╝\n");
        console.log("→ เปิดแอป LINE → จะมี popup ขึ้นมาให้ใส่รหัส");
        console.log("→ รอการยืนยัน...\n");
      },
    },
    {
      device: "IOSIPAD",
      storage,
    }
  );

  console.log("✓ เข้าสู่ระบบ LINE สำเร็จ!\n");

  const authToken = client.authToken;
  const refreshToken = await storage.get("refreshToken");
  const expireRaw = await storage.get("expire");

  console.log(`Access Token:  ${authToken.substring(0, 20)}...`);
  console.log(`Refresh Token: ${refreshToken ? String(refreshToken).substring(0, 20) + "..." : "ไม่มี"}`);
  console.log(`Expires:       ${expireRaw ?? "ไม่ทราบ"}\n`);

  const expireAt = typeof expireRaw === "number"
    ? new Date(expireRaw * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from("payment_accounts")
    .update({
      line_auth_token: authToken,
      line_refresh_token: refreshToken ? String(refreshToken) : null,
      line_token_expires_at: expireAt,
      line_connected: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ACCOUNT_ID);

  if (error) {
    console.error("✗ บันทึก token ลง DB ไม่สำเร็จ:", error.message);
  } else {
    console.log("✓ บันทึก auth token + refresh token ลง DB สำเร็จ!");
    console.log("\n→ ระบบพร้อมรับแจ้งเตือนจากธนาคารแล้ว");
    console.log("→ restart API server เพื่อเริ่ม auto-connect");
    console.log("→ token หมดอายุจะ refresh อัตโนมัติ\n");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
