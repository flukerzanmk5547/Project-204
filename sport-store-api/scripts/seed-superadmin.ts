/**
 * Seed SuperAdmin Script
 *
 * สร้าง superadmin user หรืออัปเกรด user ที่มีอยู่แล้วเป็น superadmin
 *
 * วิธีใช้: bun run scripts/seed-superadmin.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const SUPERADMIN = {
  email: "superadmin@sportgear.com",
  password: "SuperAdmin@2024!",
  name: "Super Admin",
};

async function main(): Promise<void> {
  console.log("═══════════════════════════════════════");
  console.log("  Seed SuperAdmin");
  console.log("═══════════════════════════════════════\n");

  // Check if already exists in profiles
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("email", SUPERADMIN.email)
    .limit(1);

  if (existing && existing.length > 0) {
    if (existing[0].role === "superadmin") {
      console.log(`✓ SuperAdmin "${SUPERADMIN.email}" มีอยู่แล้วและเป็น superadmin`);
    } else {
      console.log(`→ พบ user "${SUPERADMIN.email}" แต่ role = "${existing[0].role}" — อัปเกรดเป็น superadmin...`);
      await supabase
        .from("profiles")
        .update({ role: "superadmin" })
        .eq("id", existing[0].id);
      console.log("✓ อัปเกรดเป็น superadmin สำเร็จ");
    }
  } else {
    console.log("→ สร้าง superadmin user ใหม่...");

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
          email: SUPERADMIN.email,
          password: SUPERADMIN.password,
          email_confirm: true,
          user_metadata: {
            full_name: SUPERADMIN.name,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      if (err?.msg?.includes("already been registered")) {
        console.log("✓ User มีอยู่ใน auth แล้ว — อัปเดต role ใน profiles");
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", SUPERADMIN.email)
          .limit(1);
        if (profiles?.[0]) {
          await supabase
            .from("profiles")
            .update({ role: "superadmin" })
            .eq("id", profiles[0].id);
        }
      } else {
        console.error("✗ สร้าง user ไม่สำเร็จ:", err);
        process.exit(1);
      }
    } else {
      const body = await res.json();
      console.log(`✓ สร้าง auth user: ${body.id}`);

      // Wait for trigger to create profile
      await new Promise((r) => setTimeout(r, 1000));

      await supabase
        .from("profiles")
        .update({ role: "superadmin" })
        .eq("id", body.id);

      console.log("✓ ตั้ง role เป็น superadmin");
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`  Email:    ${SUPERADMIN.email}`);
  console.log(`  Password: ${SUPERADMIN.password}`);
  console.log(`  Role:     superadmin`);
  console.log("═══════════════════════════════════════\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
