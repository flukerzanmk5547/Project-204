/**
 * UAT Seed Script
 *
 * สร้าง test user + ตรวจสอบ payment account สำหรับ UAT testing
 *
 * วิธีใช้: bun run scripts/seed-uat.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const TEST_USER = {
  email: "uat@test.com",
  password: "Test1234!",
  name: "UAT Tester",
  phone: "0900000000",
};

async function seedTestUser(): Promise<void> {
  console.log("\n[1/3] สร้าง test user...");

  const { data: existingUsers } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", TEST_USER.email)
    .limit(1);

  if (existingUsers && existingUsers.length > 0) {
    console.log(`  ✓ Test user "${TEST_USER.email}" มีอยู่แล้ว`);
    return;
  }

  const res = await fetch(
    `${process.env.SUPABASE_URL}/auth/v1/admin/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_KEY!,
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
        email_confirm: true,
        user_metadata: {
          full_name: TEST_USER.name,
          phone: TEST_USER.phone,
        },
      }),
    }
  );

  if (res.ok) {
    console.log(`  ✓ สร้าง test user: ${TEST_USER.email} / ${TEST_USER.password}`);
  } else {
    const err = await res.json();
    if (
      typeof err?.msg === "string" &&
      err.msg.includes("already been registered")
    ) {
      console.log(`  ✓ Test user "${TEST_USER.email}" มีอยู่แล้ว (auth)`);
    } else {
      console.error("  ✗ สร้าง test user ไม่สำเร็จ:", err);
    }
  }
}

async function seedTestAddress(): Promise<void> {
  console.log("\n[2/3] สร้าง test address...");

  const { data: users } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", TEST_USER.email)
    .limit(1);

  if (!users || users.length === 0) {
    console.log("  ⚠ ไม่พบ test user — ข้าม");
    return;
  }

  const userId = users[0].id;

  const { data: existing } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (existing && existing.length > 0) {
    console.log("  ✓ Test address มีอยู่แล้ว");
    return;
  }

  const { error } = await supabase.from("user_addresses").insert({
    user_id: userId,
    label: "บ้าน (UAT)",
    full_name: TEST_USER.name,
    phone: TEST_USER.phone,
    address: "123 ถนนทดสอบ ซอย UAT",
    district: "ลาดพร้าว",
    amphoe: "ลาดพร้าว",
    province: "กรุงเทพมหานคร",
    postal_code: "10230",
    is_default: true,
  });

  if (error) {
    console.error("  ✗ สร้าง address ไม่สำเร็จ:", error.message);
  } else {
    console.log("  ✓ สร้าง test address สำเร็จ");
  }
}

async function checkPaymentAccount(): Promise<void> {
  console.log("\n[3/3] ตรวจสอบ payment account...");

  const { data, error } = await supabase
    .from("payment_accounts")
    .select("id, label, promptpay_number, is_active, line_connected")
    .eq("is_active", true);

  if (error) {
    console.error("  ✗ ตรวจสอบไม่สำเร็จ:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log("  ⚠ ไม่มี active payment account — กรุณารัน seed-payment-account ก่อน");
    return;
  }

  for (const acc of data) {
    console.log(
      `  ✓ ${acc.label} (${acc.promptpay_number}) — active=${acc.is_active}, line=${acc.line_connected}`
    );
  }
}

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════");
  console.log("  UAT Seed Script");
  console.log("═══════════════════════════════════════");

  await seedTestUser();
  await seedTestAddress();
  await checkPaymentAccount();

  console.log("\n═══════════════════════════════════════");
  console.log("  UAT Seed เสร็จสิ้น!");
  console.log("");
  console.log("  วิธีรัน UAT mode:");
  console.log("    NODE_ENV=uat bun run dev");
  console.log("");
  console.log("  วิธีรัน UAT + auto-confirm:");
  console.log("    NODE_ENV=uat UAT_AUTO_CONFIRM_PAYMENT=true bun run dev");
  console.log("");
  console.log(`  Test user: ${TEST_USER.email} / ${TEST_USER.password}`);
  console.log("═══════════════════════════════════════\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
