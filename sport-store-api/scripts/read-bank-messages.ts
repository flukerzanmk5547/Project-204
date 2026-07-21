/**
 * สคริปดึง message ล่าสุดจาก LINE chat ของธนาคาร SCB
 *
 * วิธีใช้: bun run scripts/read-bank-messages.ts
 */

import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const ACCOUNT_ID = "a0000001-0000-0000-0000-000000000001";
const SCB_MID = "u4ca19114ed596ee2f4e63335ec7143fb";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
  console.log("===========================================");
  console.log("  ดึง message ล่าสุดจาก SCB LINE Chat");
  console.log("===========================================\n");

  const { data: account, error } = await supabase
    .from("payment_accounts")
    .select("line_auth_token, line_refresh_token")
    .eq("id", ACCOUNT_ID)
    .single();

  if (error || !account?.line_auth_token) {
    console.error("ไม่พบ auth token ใน DB กรุณา login ก่อน");
    process.exit(1);
  }

  console.log("กำลังเชื่อมต่อ LINE...\n");

  const storage = new FileStorage(`./line_storage_${ACCOUNT_ID}.json`);

  const tokenInput: { accessToken: string; refreshToken?: string } = {
    accessToken: account.line_auth_token,
  };
  if (account.line_refresh_token) {
    tokenInput.refreshToken = account.line_refresh_token;
  }

  const client = await loginWithAuthToken(tokenInput, {
    device: "IOSIPAD",
    storage,
  });

  console.log("✓ เชื่อมต่อ LINE สำเร็จ!\n");

  // ดึง message boxes ทั้งหมด
  console.log("กำลังดึงรายการแชท...\n");

  const base = (client as unknown as { base: Record<string, unknown> }).base as {
    talk: {
      getMessageBoxes: (arg: unknown) => Promise<{
        messageBoxes: Array<{
          id: string;
          lastDeliveredMessageId: { deliveredTime: unknown; messageId: number };
          midType: string;
        }>;
      }>;
      getPreviousMessagesV2WithRequest: (arg: unknown) => Promise<
        Array<{
          id: string;
          from: string;
          to: string;
          text: string;
          contentType: string;
          deliveredTime: unknown;
          contentMetadata: Record<string, string>;
        }>
      >;
    };
  };

  const boxes = await base.talk.getMessageBoxes({
    messageBoxListRequest: {},
  });

  // หา SCB message box
  const scbBox = boxes.messageBoxes.find((box) => box.id === SCB_MID);

  if (!scbBox) {
    console.log("ไม่พบแชท SCB ในรายการ message box\n");
    console.log("รายการแชททั้งหมด:");
    boxes.messageBoxes.forEach((box) => {
      console.log(`  - ${box.id} (type: ${box.midType})`);
    });
    process.exit(0);
  }

  console.log(`✓ พบแชท SCB! (ID: ${scbBox.id})\n`);
  console.log("กำลังดึง 10 message ล่าสุด...\n");

  const messages = await base.talk.getPreviousMessagesV2WithRequest({
    request: {
      messageBoxId: scbBox.id,
      endMessageId: scbBox.lastDeliveredMessageId,
      messagesCount: 10,
    },
  });

  console.log(`พบ ${messages.length} messages:\n`);
  console.log("═".repeat(60));

  messages.forEach((msg, i) => {
    console.log(`\n[${i + 1}] ─────────────────────────────────────`);
    console.log(`  From: ${msg.from}`);
    console.log(`  To:   ${msg.to}`);
    console.log(`  Type: ${msg.contentType}`);
    console.log(`  Time: ${msg.deliveredTime}`);

    if (msg.text) {
      console.log(`  Text:`);
      console.log(`  ┌${"─".repeat(54)}┐`);
      msg.text.split("\n").forEach((line) => {
        console.log(`  │ ${line.padEnd(52)} │`);
      });
      console.log(`  └${"─".repeat(54)}┘`);
    } else {
      console.log(`  Text: (ไม่มี — อาจเป็น sticker/flex/image)`);
    }

    if (
      msg.contentMetadata &&
      Object.keys(msg.contentMetadata).length > 0
    ) {
      console.log(
        `  Metadata:`,
        JSON.stringify(msg.contentMetadata, null, 2).substring(0, 500)
      );
    }
  });

  console.log("\n" + "═".repeat(60));
  console.log("เสร็จสิ้น\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
