-- ============================================
-- Seed: บัญชีชำระเงินทดสอบ
-- ============================================

INSERT INTO payment_accounts (id, label, promptpay_number, is_active, sort_order)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'บัญชีทดสอบ',
  '0989518191',
  true,
  1
)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  promptpay_number = EXCLUDED.promptpay_number,
  is_active = EXCLUDED.is_active;

-- เพิ่ม bank chats ทั้ง 4 ธนาคาร
INSERT INTO bank_chats (account_id, bank_code, bank_name, line_chat_mid, is_active)
VALUES
  ('a0000001-0000-0000-0000-000000000001', 'kbank', 'กสิกรไทย (KBank)', 'u8cc52e369d2bca4a5ce8c506170c712e', true),
  ('a0000001-0000-0000-0000-000000000001', 'scb',   'ไทยพาณิชย์ (SCB)',  'u4ca19114ed596ee2f4e63335ec7143fb', true),
  ('a0000001-0000-0000-0000-000000000001', 'ktb',   'กรุงไทย (KTB)',     'uce372f6ada1d1a0855973fefc2942f9a', true),
  ('a0000001-0000-0000-0000-000000000001', 'gsb',   'ออมสิน (GSB)',      'ub2a0ffaaab7e5bdd10814ec88afe67fc', true)
ON CONFLICT DO NOTHING;
