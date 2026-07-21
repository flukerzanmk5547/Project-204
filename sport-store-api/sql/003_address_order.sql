-- ============================================
-- 1. user_addresses — ที่อยู่ลูกค้า
-- ============================================
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  province TEXT NOT NULL,
  amphoe TEXT NOT NULL,
  district TEXT,
  address TEXT NOT NULL,
  note TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);

-- ============================================
-- 2. ALTER orders — เพิ่ม columns สำหรับ shipping / payment
-- ============================================
ALTER TABLE orders
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number TEXT,
  ADD COLUMN IF NOT EXISTS shipping_name TEXT,
  ADD COLUMN IF NOT EXISTS shipping_phone TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address TEXT,
  ADD COLUMN IF NOT EXISTS shipping_province TEXT,
  ADD COLUMN IF NOT EXISTS shipping_amphoe TEXT,
  ADD COLUMN IF NOT EXISTS shipping_district TEXT,
  ADD COLUMN IF NOT EXISTS shipping_postal_code TEXT,
  ADD COLUMN IF NOT EXISTS shipping_note TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_total NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2) DEFAULT 0;

-- Drop existing check constraint and add new status values
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'));

-- ============================================
-- 3. ALTER order_items — เพิ่ม columns สำหรับ display info
-- ============================================
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS size TEXT,
  ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);

-- Allow null product reference for guest orders
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;

-- ============================================
-- 4. RLS policies for user_addresses
-- ============================================
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addresses" ON user_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON user_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON user_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON user_addresses
  FOR DELETE USING (auth.uid() = user_id);
