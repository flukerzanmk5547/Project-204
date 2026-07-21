-- 014: ตารางเก็บแบบประเมินความพึงพอใจ (Feedback)
--
-- เดิม FeedbackPanel ฝั่ง frontend กดส่งได้แต่ข้อมูลหายทันที
-- ตารางนี้เก็บผลประเมินไว้ให้ฝั่ง backoffice ดูย้อนหลังได้
--
-- user_id เป็น NULL ได้ เพราะผู้ใช้ทั่วไป (ยังไม่ล็อกอิน) ก็ส่งแบบประเมินได้

CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  purpose TEXT,
  achieved TEXT,
  comment TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks (rating);
