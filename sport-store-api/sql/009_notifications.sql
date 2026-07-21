-- ============================================
-- 009: Notifications (แจ้งเตือนหลังบ้าน)
-- reseller / manager จะเห็น alert เมื่อมีลูกค้าสั่งซื้อใหม่ ฯลฯ
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL DEFAULT 'order'
    CHECK (type IN ('order', 'payment', 'stock', 'user', 'system')),
  title TEXT NOT NULL,
  detail TEXT,
  audience TEXT NOT NULL DEFAULT 'staff'
    CHECK (audience IN ('staff', 'customer')),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  actor_name TEXT,
  amount NUMERIC(10, 2),
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_feed
  ON notifications(audience, is_read, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- API เข้าถึงผ่าน service-role (bypass RLS) — policy ไว้เผื่อ client อื่น
CREATE POLICY "public_read" ON notifications FOR SELECT USING (true);
CREATE POLICY "auth_write" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update" ON notifications FOR UPDATE USING (true);
