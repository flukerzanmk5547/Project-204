import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
  console.log("Creating user_favorites table...");

  // Check if table exists by trying to query it
  const { error: checkError } = await supabase
    .from("user_favorites")
    .select("id")
    .limit(1);

  if (!checkError) {
    console.log("✓ user_favorites table already exists");
    process.exit(0);
  }

  // Use the SQL endpoint via RPC — if not available, create via REST
  // Supabase doesn't expose raw SQL via client, so we'll use a workaround:
  // Create the table by inserting and deleting (won't work for DDL)
  // Instead, try the database endpoint
  console.log("Table doesn't exist. Trying to create via Supabase SQL...");

  const sqlStatements = [
    `CREATE TABLE IF NOT EXISTS user_favorites (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_favorites(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_favorites_product ON user_favorites(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_favorites_created ON user_favorites(created_at DESC)`,
    `ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY`,
    `CREATE POLICY IF NOT EXISTS "favorites_public_read" ON user_favorites FOR SELECT USING (true)`,
    `CREATE POLICY IF NOT EXISTS "favorites_public_insert" ON user_favorites FOR INSERT WITH CHECK (true)`,
    `CREATE POLICY IF NOT EXISTS "favorites_public_delete" ON user_favorites FOR DELETE USING (true)`,
  ];

  // Use Supabase SQL API (available on some setups)
  const url = `${process.env.SUPABASE_URL}/rest/v1/`;

  for (const sql of sqlStatements) {
    const res = await fetch(`${process.env.SUPABASE_URL}/pg/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!res.ok) {
      console.log(`⚠ SQL API not available (${res.status}). Please run the following SQL manually in Supabase Dashboard > SQL Editor:`);
      console.log("\n------- COPY THIS SQL -------\n");
      console.log(sqlStatements.join(";\n\n") + ";");
      console.log("\n------- END SQL -------\n");
      process.exit(1);
    }
  }

  console.log("✓ user_favorites table created successfully");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
