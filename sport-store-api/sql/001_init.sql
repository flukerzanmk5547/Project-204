-- ============================================
-- SportGear Thailand - Database Schema v2
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Categories (nested hierarchy with routing)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  route_path TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  icon_name TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  level INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  banner_image TEXT,
  banner_title TEXT,
  banner_subtitle TEXT,
  banner_cta TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_route ON categories(route_path);
CREATE INDEX idx_categories_level ON categories(level);

-- ============================================
-- 3. Products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_full TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  original_price NUMERIC(10, 2),
  brand TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  images JSONB DEFAULT '[]'::JSONB,
  tags JSONB DEFAULT '[]'::JSONB,
  colors JSONB DEFAULT '[]'::JSONB,
  sizes JSONB DEFAULT '[]'::JSONB,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  discount_label TEXT,
  benefits JSONB DEFAULT '[]'::JSONB,
  specifications JSONB DEFAULT '{}'::JSONB,
  rating NUMERIC(2, 1),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_new ON products(is_new);

-- ============================================
-- 4. Cart Items
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- ============================================
-- 5. Reviews
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  author_name TEXT,
  author_country TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_translated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ============================================
-- 6. Banners (hero, category, promo)
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('hero', 'category', 'promo')),
  title TEXT NOT NULL,
  subtitle TEXT,
  hashtag TEXT,
  cta TEXT,
  image TEXT NOT NULL,
  link TEXT,
  section_key TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_banners_type ON banners(type);
CREATE INDEX idx_banners_section ON banners(section_key);

-- ============================================
-- 7. Homepage Sections
-- ============================================
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('deals', 'category', 'featured')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. Homepage Section Products (junction)
-- ============================================
CREATE TABLE IF NOT EXISTS homepage_section_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES homepage_sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(section_id, product_id)
);

CREATE INDEX idx_hsp_section ON homepage_section_products(section_id);

-- ============================================
-- 9. Sub Category Items (icon/image rows)
-- ============================================
CREATE TABLE IF NOT EXISTS sub_category_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES homepage_sections(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  image TEXT,
  icon_name TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_cat_section ON sub_category_items(section_id);

-- ============================================
-- 10. Site Config
-- ============================================
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. Category Shortcuts (homepage)
-- ============================================
CREATE TABLE IF NOT EXISTS category_shortcuts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  image TEXT,
  text_overlay TEXT,
  link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- 12. Promotions (โปรโมชั่น / ดีล)
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'buy_x_get_y', 'label_only')),
  discount_value NUMERIC(10, 2),
  discount_label TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_promotions_active ON promotions(is_active, start_date, end_date);

-- ============================================
-- 13. Promotion Products (สินค้าที่อยู่ในโปร)
-- ============================================
CREATE TABLE IF NOT EXISTS promotion_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  override_price NUMERIC(10, 2),
  override_label TEXT,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(promotion_id, product_id)
);

CREATE INDEX idx_promo_products_promo ON promotion_products(promotion_id);
CREATE INDEX idx_promo_products_product ON promotion_products(product_id);

-- ============================================
-- 14. Product Bundles (ซื้อเป็นเซ็ต)
-- Admin สร้าง bundle → เลือกสินค้าจับคู่ → ตั้งราคาเซ็ตหรือ % ส่วนลด
-- ============================================
CREATE TABLE IF NOT EXISTS product_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'none' CHECK (discount_type IN ('none', 'percentage', 'fixed_amount', 'fixed_price')),
  discount_value NUMERIC(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bundles_active ON product_bundles(is_active);

-- ============================================
-- 15. Bundle Items (สินค้าในแต่ละ bundle)
-- ============================================
CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID NOT NULL REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  sort_order INTEGER DEFAULT 0,
  UNIQUE(bundle_id, product_id)
);

CREATE INDEX idx_bundle_items_bundle ON bundle_items(bundle_id);
CREATE INDEX idx_bundle_items_product ON bundle_items(product_id);

-- ============================================
-- 16. Product Bundle Links (เชื่อม product หลักกับ bundle ที่เสนอ)
-- เมื่อลูกค้าดูสินค้า A → แสดง bundle ที่มี A อยู่ใน "ซื้อเป็นเซ็ต"
-- ============================================
CREATE TABLE IF NOT EXISTS product_bundle_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  bundle_id UUID NOT NULL REFERENCES product_bundles(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(product_id, bundle_id)
);

CREATE INDEX idx_pbl_product ON product_bundle_links(product_id);
CREATE INDEX idx_pbl_bundle ON product_bundle_links(bundle_id);

-- ============================================
-- 17. Product Views (ประวัติการดูสินค้า)
-- ============================================
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_views_user ON product_views(user_id);
CREATE INDEX idx_product_views_session ON product_views(session_id);
CREATE INDEX idx_product_views_product ON product_views(product_id);
CREATE INDEX idx_product_views_time ON product_views(viewed_at DESC);

-- ============================================
-- 15. Order Items (ประวัติการซื้อ — สำหรับ "คนที่ซื้อสินค้านี้ ยังซื้อ...")
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- 16. Attribute Groups (ประเภท attribute ของสินค้า)
-- e.g. "ไซส์เสื้อผ้า", "ไซส์รองเท้า", "ความหนา", "ขนาด"
-- ============================================
CREATE TABLE IF NOT EXISTS attribute_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_type TEXT DEFAULT 'select' CHECK (display_type IN ('select', 'color', 'button', 'text')),
  unit TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. Attribute Options (ค่าที่เลือกได้ในแต่ละ group)
-- e.g. S, M, L, XL for "ไซส์เสื้อผ้า"
-- ============================================
CREATE TABLE IF NOT EXISTS attribute_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES attribute_groups(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  color_hex TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(group_id, value)
);

CREATE INDEX idx_attr_options_group ON attribute_options(group_id);

-- ============================================
-- 14. Category Attribute Groups (เชื่อม category กับ attribute ที่ใช้ได้)
-- e.g. "เสื้อผ้าผู้ชาย" → "ไซส์เสื้อผ้า" + "สี"
-- ============================================
CREATE TABLE IF NOT EXISTS category_attribute_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES attribute_groups(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  UNIQUE(category_id, group_id)
);

CREATE INDEX idx_cat_attr_category ON category_attribute_groups(category_id);

-- ============================================
-- 15. Product Variants (SKU ของแต่ละ combination)
-- e.g. เสื้อยืด สีดำ ไซส์ M = 1 variant
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  price_override NUMERIC(10, 2),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ============================================
-- 16. Variant Attribute Values (ค่า attribute ของแต่ละ variant)
-- ============================================
CREATE TABLE IF NOT EXISTS variant_attribute_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES attribute_groups(id) ON DELETE CASCADE,
  option_id UUID REFERENCES attribute_options(id) ON DELETE SET NULL,
  custom_value TEXT,
  UNIQUE(variant_id, group_id)
);

CREATE INDEX idx_var_attr_variant ON variant_attribute_values(variant_id);

-- ============================================
-- Functions & Triggers
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_cart_items_updated BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_reviews_updated BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_banners_updated BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_bundles_updated BEFORE UPDATE ON product_bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_promotions_updated BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_attr_groups_updated BEFORE UPDATE ON attribute_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_variants_updated BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id UUID;
BEGIN
  target_product_id := COALESCE(NEW.product_id, OLD.product_id);
  UPDATE products
  SET
    rating = (SELECT AVG(rating)::NUMERIC(2,1) FROM reviews WHERE product_id = target_product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = target_product_id)
  WHERE id = target_product_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_reviews_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE OR REPLACE FUNCTION update_product_stock(product_id UUID, quantity_change INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET stock = stock + quantity_change
  WHERE id = product_id AND stock + quantity_change >= 0;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, phone)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_section_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_category_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_shortcuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_bundle_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_attribute_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_attribute_values ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read" ON products FOR SELECT USING (true);
CREATE POLICY "public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "public_read" ON banners FOR SELECT USING (true);
CREATE POLICY "public_read" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "public_read" ON homepage_section_products FOR SELECT USING (true);
CREATE POLICY "public_read" ON sub_category_items FOR SELECT USING (true);
CREATE POLICY "public_read" ON site_config FOR SELECT USING (true);
CREATE POLICY "public_read" ON category_shortcuts FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_bundles FOR SELECT USING (true);
CREATE POLICY "public_read" ON bundle_items FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_bundle_links FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_views FOR SELECT USING (true);
CREATE POLICY "public_insert" ON product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "owner_all" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "public_read" ON order_items FOR SELECT USING (true);
CREATE POLICY "auth_write" ON order_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "public_read" ON promotions FOR SELECT USING (true);
CREATE POLICY "public_read" ON promotion_products FOR SELECT USING (true);
CREATE POLICY "public_read" ON attribute_groups FOR SELECT USING (true);
CREATE POLICY "public_read" ON attribute_options FOR SELECT USING (true);
CREATE POLICY "public_read" ON category_attribute_groups FOR SELECT USING (true);
CREATE POLICY "public_read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "public_read" ON variant_attribute_values FOR SELECT USING (true);

-- Owner policies
CREATE POLICY "owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "owner_all" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "owner_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owner_update" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "owner_delete" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Auth write (admin/employee managed via API-level checks)
CREATE POLICY "auth_write" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON categories FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON products FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON banners FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON banners FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON banners FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON homepage_sections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON homepage_sections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON homepage_sections FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON homepage_section_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON homepage_section_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON homepage_section_products FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON sub_category_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON sub_category_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON sub_category_items FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON site_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON site_config FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON category_shortcuts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON category_shortcuts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON category_shortcuts FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON promotions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON promotions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON promotions FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON promotion_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON promotion_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON promotion_products FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_bundles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON product_bundles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON product_bundles FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON bundle_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON bundle_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON bundle_items FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_bundle_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON product_bundle_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON product_bundle_links FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON attribute_groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON attribute_groups FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON attribute_groups FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON attribute_options FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON attribute_options FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON attribute_options FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON category_attribute_groups FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON category_attribute_groups FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON category_attribute_groups FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON product_variants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON product_variants FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON product_variants FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_write" ON variant_attribute_values FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update" ON variant_attribute_values FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete" ON variant_attribute_values FOR DELETE USING (auth.role() = 'authenticated');
