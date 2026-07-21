-- ============================================
-- 010: User Favorites (สินค้าโปรด)
-- ============================================

CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_favorites_product ON user_favorites(product_id);
CREATE INDEX idx_favorites_created ON user_favorites(created_at DESC);

-- RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_public_read" ON user_favorites FOR SELECT USING (true);
CREATE POLICY "favorites_public_insert" ON user_favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "favorites_public_delete" ON user_favorites FOR DELETE USING (true);
