-- ============================================
-- payments — ระบบชำระเงินพร้อมเพย์
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  method TEXT NOT NULL DEFAULT 'promptpay',
  amount NUMERIC(10, 2) NOT NULL,
  ref_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'expired', 'failed')),
  promptpay_number TEXT,
  qr_payload TEXT,
  line_message_id TEXT,
  line_matched_text TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_ref_amount ON payments(ref_amount);
