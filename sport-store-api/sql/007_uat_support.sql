-- 007: UAT Support — เพิ่ม is_test flag สำหรับแยก order/payment ทดสอบจาก production

ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_orders_is_test ON orders (is_test) WHERE is_test = true;
CREATE INDEX IF NOT EXISTS idx_payments_is_test ON payments (is_test) WHERE is_test = true;
