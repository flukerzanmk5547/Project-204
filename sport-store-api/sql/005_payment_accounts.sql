-- ============================================
-- payment_accounts — บัญชีพร้อมเพย์ (จัดการผ่าน admin)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  promptpay_number TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  line_auth_token TEXT,
  line_refresh_token TEXT,
  line_token_expires_at TIMESTAMPTZ,
  line_device TEXT DEFAULT 'IOSIPAD',
  line_connected BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- bank_chats — LINE chat ID ของแต่ละธนาคาร
-- ============================================
CREATE TABLE IF NOT EXISTS bank_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES payment_accounts(id) ON DELETE CASCADE,
  bank_code TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  line_chat_mid TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bank_chats_account ON bank_chats(account_id);
CREATE INDEX idx_bank_chats_mid ON bank_chats(line_chat_mid);

-- เพิ่ม account_id ให้ payments table
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES payment_accounts(id) ON DELETE SET NULL;
