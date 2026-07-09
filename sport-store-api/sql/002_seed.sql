-- ============================================
-- SportGear Thailand - Seed Data v2
-- Matched exactly to frontend mock data
-- ============================================

-- ============================================
-- SITE CONFIG
-- ============================================
INSERT INTO site_config (key, value, type, description) VALUES
  ('free_shipping_threshold', '999', 'number', 'ยอดสั่งซื้อขั้นต่ำเพื่อรับส่งฟรี'),
  ('announcement_text', 'ส่งฟรีทั่วไทย เมื่อสั่งซื้อสินค้า 999.-', 'string', 'ข้อความ announcement bar'),
  ('currency', 'THB', 'string', 'สกุลเงิน'),
  ('store_name', 'SPORTGEAR', 'string', 'ชื่อร้าน'),
  ('total_products', '7000', 'number', 'จำนวนสินค้าทั้งหมดในร้าน'),
  ('total_sport_types', '70', 'number', 'จำนวนประเภทกีฬา');

-- ============================================
-- CATEGORIES (Level 0 = root, 1 = sub, 2 = sub-sub, 3 = leaf)
-- ============================================

-- Root categories
INSERT INTO categories (id, name, slug, route_path, level, sort_order, image) VALUES
  ('c0000000-0001-0000-0000-000000000000', 'กีฬาประเภทต่างๆ', 'sports', 'sports', 0, 1, NULL),
  ('c0000000-0002-0000-0000-000000000000', 'ผู้ชาย', 'men', 'men', 0, 2, 'https://picsum.photos/id/91/200/200'),
  ('c0000000-0003-0000-0000-000000000000', 'ผู้หญิง', 'women', 'women', 0, 3, 'https://picsum.photos/id/64/200/200'),
  ('c0000000-0004-0000-0000-000000000000', 'เด็ก', 'kids', 'kids', 0, 4, 'https://picsum.photos/id/177/200/200'),
  ('c0000000-0005-0000-0000-000000000000', 'อุปกรณ์เสริมอื่นๆ', 'accessories', 'accessories', 0, 5, 'https://picsum.photos/id/111/200/200'),
  ('c0000000-0006-0000-0000-000000000000', 'สำหรับท่องเที่ยว', 'travel', 'travel', 0, 6, 'https://picsum.photos/id/15/200/200');

-- Level 1 under กีฬาประเภทต่างๆ
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order, image) VALUES
  ('c1000000-0001-0000-0000-000000000000', 'กีฬากลางแจ้ง', 'outdoor', 'sports/outdoor', 'c0000000-0001-0000-0000-000000000000', 1, 1, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'),
  ('c1000000-0002-0000-0000-000000000000', 'ฟิตเนส', 'fitness', 'sports/fitness', 'c0000000-0001-0000-0000-000000000000', 1, 2, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'),
  ('c1000000-0003-0000-0000-000000000000', 'วิ่ง & เดิน', 'running-walking', 'sports/running-walking', 'c0000000-0001-0000-0000-000000000000', 1, 3, 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400'),
  ('c1000000-0004-0000-0000-000000000000', 'กีฬาทางน้ำ', 'water-sports', 'sports/water-sports', 'c0000000-0001-0000-0000-000000000000', 1, 4, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400'),
  ('c1000000-0005-0000-0000-000000000000', 'กีฬาใช้ไม้', 'racket-sports', 'sports/racket-sports', 'c0000000-0001-0000-0000-000000000000', 1, 5, NULL),
  ('c1000000-0006-0000-0000-000000000000', 'จักรยาน', 'cycling', 'sports/cycling', 'c0000000-0001-0000-0000-000000000000', 1, 6, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400'),
  ('c1000000-0007-0000-0000-000000000000', 'กีฬาเอ็กซ์ตรีม', 'extreme-sports', 'sports/extreme-sports', 'c0000000-0001-0000-0000-000000000000', 1, 7, NULL),
  ('c1000000-0008-0000-0000-000000000000', 'กีฬาเป็นทีม', 'team-sports', 'sports/team-sports', 'c0000000-0001-0000-0000-000000000000', 1, 8, NULL),
  ('c1000000-0009-0000-0000-000000000000', 'กอล์ฟ', 'golf', 'sports/golf', 'c0000000-0001-0000-0000-000000000000', 1, 9, NULL);

-- Level 2 under กีฬากลางแจ้ง
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0001-0000-0000-000000000000', 'แคมป์ปิ้ง', 'camping', 'sports/outdoor/camping', 'c1000000-0001-0000-0000-000000000000', 2, 1),
  ('c2000000-0002-0000-0000-000000000000', 'เดินป่า', 'hiking', 'sports/outdoor/hiking', 'c1000000-0001-0000-0000-000000000000', 2, 2),
  ('c2000000-0003-0000-0000-000000000000', 'ปีนเขา', 'climbing', 'sports/outdoor/climbing', 'c1000000-0001-0000-0000-000000000000', 2, 3),
  ('c2000000-0004-0000-0000-000000000000', 'ตกปลา', 'fishing', 'sports/outdoor/fishing', 'c1000000-0001-0000-0000-000000000000', 2, 4);

-- Level 2 under ฟิตเนส
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0010-0000-0000-000000000000', 'เครื่องออกกำลังกาย', 'fitness-machines', 'sports/fitness/machines', 'c1000000-0002-0000-0000-000000000000', 2, 1),
  ('c2000000-0011-0000-0000-000000000000', 'ดัมเบล & บาร์เบล', 'dumbbells-barbells', 'sports/fitness/dumbbells', 'c1000000-0002-0000-0000-000000000000', 2, 2),
  ('c2000000-0012-0000-0000-000000000000', 'เสื่อโยคะ', 'yoga-mats', 'sports/fitness/yoga-mats', 'c1000000-0002-0000-0000-000000000000', 2, 3),
  ('c2000000-0013-0000-0000-000000000000', 'ยางยืดออกกำลังกาย', 'resistance-bands', 'sports/fitness/resistance-bands', 'c1000000-0002-0000-0000-000000000000', 2, 4),
  ('c2000000-0014-0000-0000-000000000000', 'เสื้อผ้าฟิตเนสชาย', 'mens-fitness-apparel', 'sports/fitness/mens-apparel', 'c1000000-0002-0000-0000-000000000000', 2, 5),
  ('c2000000-0015-0000-0000-000000000000', 'เสื้อผ้าฟิตเนสหญิง', 'womens-fitness-apparel', 'sports/fitness/womens-apparel', 'c1000000-0002-0000-0000-000000000000', 2, 6);

-- Level 2 under วิ่ง & เดิน
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0020-0000-0000-000000000000', 'วิ่ง', 'running', 'sports/running-walking/running', 'c1000000-0003-0000-0000-000000000000', 2, 1),
  ('c2000000-0021-0000-0000-000000000000', 'วิ่งเทรล', 'trail-running', 'sports/running-walking/trail', 'c1000000-0003-0000-0000-000000000000', 2, 2),
  ('c2000000-0022-0000-0000-000000000000', 'เดินออกกำลัง', 'walking', 'sports/running-walking/walking', 'c1000000-0003-0000-0000-000000000000', 2, 3),
  ('c2000000-0023-0000-0000-000000000000', 'ไตรกีฬา', 'triathlon', 'sports/running-walking/triathlon', 'c1000000-0003-0000-0000-000000000000', 2, 4),
  ('c2000000-0024-0000-0000-000000000000', 'อุปกรณ์นวด', 'massage-recovery', 'sports/running-walking/recovery', 'c1000000-0003-0000-0000-000000000000', 2, 5);

-- Level 3 under วิ่ง
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c3000000-0001-0000-0000-000000000000', 'รองเท้าวิ่ง', 'running-shoes', 'sports/running-walking/running/shoes', 'c2000000-0020-0000-0000-000000000000', 3, 1),
  ('c3000000-0002-0000-0000-000000000000', 'เสื้อผ้าวิ่ง', 'running-apparel', 'sports/running-walking/running/apparel', 'c2000000-0020-0000-0000-000000000000', 3, 2),
  ('c3000000-0003-0000-0000-000000000000', 'อุปกรณ์เสริมวิ่ง', 'running-accessories', 'sports/running-walking/running/accessories', 'c2000000-0020-0000-0000-000000000000', 3, 3);

-- Level 2 under กีฬาทางน้ำ
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0030-0000-0000-000000000000', 'ว่ายน้ำ', 'swimming', 'sports/water-sports/swimming', 'c1000000-0004-0000-0000-000000000000', 2, 1),
  ('c2000000-0031-0000-0000-000000000000', 'ดำน้ำ', 'diving', 'sports/water-sports/diving', 'c1000000-0004-0000-0000-000000000000', 2, 2),
  ('c2000000-0032-0000-0000-000000000000', 'เซิร์ฟ', 'surfing', 'sports/water-sports/surfing', 'c1000000-0004-0000-0000-000000000000', 2, 3),
  ('c2000000-0033-0000-0000-000000000000', 'พายเรือ', 'kayaking', 'sports/water-sports/kayaking', 'c1000000-0004-0000-0000-000000000000', 2, 4);

-- Level 2 under กีฬาใช้ไม้
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0040-0000-0000-000000000000', 'แบดมินตัน', 'badminton', 'sports/racket-sports/badminton', 'c1000000-0005-0000-0000-000000000000', 2, 1),
  ('c2000000-0041-0000-0000-000000000000', 'เทนนิส', 'tennis', 'sports/racket-sports/tennis', 'c1000000-0005-0000-0000-000000000000', 2, 2),
  ('c2000000-0042-0000-0000-000000000000', 'ปิงปอง', 'table-tennis', 'sports/racket-sports/table-tennis', 'c1000000-0005-0000-0000-000000000000', 2, 3),
  ('c2000000-0043-0000-0000-000000000000', 'สควอช', 'squash', 'sports/racket-sports/squash', 'c1000000-0005-0000-0000-000000000000', 2, 4);

-- Level 2 under จักรยาน
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0050-0000-0000-000000000000', 'จักรยานเสือภูเขา', 'mountain-bike', 'sports/cycling/mountain', 'c1000000-0006-0000-0000-000000000000', 2, 1),
  ('c2000000-0051-0000-0000-000000000000', 'จักรยานเสือหมอบ', 'road-bike', 'sports/cycling/road', 'c1000000-0006-0000-0000-000000000000', 2, 2),
  ('c2000000-0052-0000-0000-000000000000', 'จักรยานพับ', 'folding-bike', 'sports/cycling/folding', 'c1000000-0006-0000-0000-000000000000', 2, 3),
  ('c2000000-0053-0000-0000-000000000000', 'อุปกรณ์เสริม', 'cycling-accessories', 'sports/cycling/accessories', 'c1000000-0006-0000-0000-000000000000', 2, 4);

-- Level 2 under กีฬาเอ็กซ์ตรีม
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0060-0000-0000-000000000000', 'สเก็ตบอร์ด', 'skateboard', 'sports/extreme-sports/skateboard', 'c1000000-0007-0000-0000-000000000000', 2, 1),
  ('c2000000-0061-0000-0000-000000000000', 'โรลเลอร์สเก็ต', 'roller-skate', 'sports/extreme-sports/roller-skate', 'c1000000-0007-0000-0000-000000000000', 2, 2),
  ('c2000000-0062-0000-0000-000000000000', 'สกูตเตอร์', 'scooter', 'sports/extreme-sports/scooter', 'c1000000-0007-0000-0000-000000000000', 2, 3);

-- Level 2 under กีฬาเป็นทีม
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0070-0000-0000-000000000000', 'ฟุตบอล', 'football', 'sports/team-sports/football', 'c1000000-0008-0000-0000-000000000000', 2, 1),
  ('c2000000-0071-0000-0000-000000000000', 'บาสเก็ตบอล', 'basketball', 'sports/team-sports/basketball', 'c1000000-0008-0000-0000-000000000000', 2, 2),
  ('c2000000-0072-0000-0000-000000000000', 'วอลเลย์บอล', 'volleyball', 'sports/team-sports/volleyball', 'c1000000-0008-0000-0000-000000000000', 2, 3),
  ('c2000000-0073-0000-0000-000000000000', 'รักบี้', 'rugby', 'sports/team-sports/rugby', 'c1000000-0008-0000-0000-000000000000', 2, 4);

-- Level 2 under กอล์ฟ
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0080-0000-0000-000000000000', 'ไม้กอล์ฟ', 'golf-clubs', 'sports/golf/clubs', 'c1000000-0009-0000-0000-000000000000', 2, 1),
  ('c2000000-0081-0000-0000-000000000000', 'ลูกกอล์ฟ', 'golf-balls', 'sports/golf/balls', 'c1000000-0009-0000-0000-000000000000', 2, 2),
  ('c2000000-0082-0000-0000-000000000000', 'ถุงกอล์ฟ', 'golf-bags', 'sports/golf/bags', 'c1000000-0009-0000-0000-000000000000', 2, 3);

-- Level 1 under ผู้ชาย
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c1000000-0020-0000-0000-000000000000', 'เสื้อผ้า', 'mens-clothing', 'men/clothing', 'c0000000-0002-0000-0000-000000000000', 1, 1),
  ('c1000000-0021-0000-0000-000000000000', 'รองเท้า', 'mens-shoes', 'men/shoes', 'c0000000-0002-0000-0000-000000000000', 1, 2),
  ('c1000000-0022-0000-0000-000000000000', 'อุปกรณ์เสริม', 'mens-accessories', 'men/accessories', 'c0000000-0002-0000-0000-000000000000', 1, 3);

-- Level 2 under ผู้ชาย > เสื้อผ้า
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0090-0000-0000-000000000000', 'เสื้อยืด', 'mens-tshirts', 'men/clothing/tshirts', 'c1000000-0020-0000-0000-000000000000', 2, 1),
  ('c2000000-0091-0000-0000-000000000000', 'กางเกงขาสั้น', 'mens-shorts', 'men/clothing/shorts', 'c1000000-0020-0000-0000-000000000000', 2, 2),
  ('c2000000-0092-0000-0000-000000000000', 'กางเกงขายาว', 'mens-pants', 'men/clothing/pants', 'c1000000-0020-0000-0000-000000000000', 2, 3),
  ('c2000000-0093-0000-0000-000000000000', 'แจ็คเก็ต', 'mens-jackets', 'men/clothing/jackets', 'c1000000-0020-0000-0000-000000000000', 2, 4);

-- Level 2 under ผู้ชาย > รองเท้า
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0094-0000-0000-000000000000', 'รองเท้าวิ่ง', 'mens-running-shoes', 'men/shoes/running', 'c1000000-0021-0000-0000-000000000000', 2, 1),
  ('c2000000-0095-0000-0000-000000000000', 'รองเท้าเทรนนิ่ง', 'mens-training-shoes', 'men/shoes/training', 'c1000000-0021-0000-0000-000000000000', 2, 2),
  ('c2000000-0096-0000-0000-000000000000', 'รองเท้าเดินป่า', 'mens-hiking-shoes', 'men/shoes/hiking', 'c1000000-0021-0000-0000-000000000000', 2, 3),
  ('c2000000-0097-0000-0000-000000000000', 'รองเท้าแตะ', 'mens-sandals', 'men/shoes/sandals', 'c1000000-0021-0000-0000-000000000000', 2, 4);

-- Level 2 under ผู้ชาย > อุปกรณ์เสริม
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-0098-0000-0000-000000000000', 'กระเป๋า', 'mens-bags', 'men/accessories/bags', 'c1000000-0022-0000-0000-000000000000', 2, 1),
  ('c2000000-0099-0000-0000-000000000000', 'ถุงเท้า', 'mens-socks', 'men/accessories/socks', 'c1000000-0022-0000-0000-000000000000', 2, 2),
  ('c2000000-009a-0000-0000-000000000000', 'หมวก', 'mens-hats', 'men/accessories/hats', 'c1000000-0022-0000-0000-000000000000', 2, 3),
  ('c2000000-009b-0000-0000-000000000000', 'แว่นตา', 'mens-eyewear', 'men/accessories/eyewear', 'c1000000-0022-0000-0000-000000000000', 2, 4);

-- Level 1 under ผู้หญิง
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c1000000-0030-0000-0000-000000000000', 'เสื้อผ้า', 'womens-clothing', 'women/clothing', 'c0000000-0003-0000-0000-000000000000', 1, 1),
  ('c1000000-0031-0000-0000-000000000000', 'รองเท้า', 'womens-shoes', 'women/shoes', 'c0000000-0003-0000-0000-000000000000', 1, 2),
  ('c1000000-0032-0000-0000-000000000000', 'อุปกรณ์เสริม', 'womens-accessories', 'women/accessories', 'c0000000-0003-0000-0000-000000000000', 1, 3);

-- Level 2 under ผู้หญิง > เสื้อผ้า
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00a0-0000-0000-000000000000', 'สปอร์ตบรา', 'womens-sportbra', 'women/clothing/sportbra', 'c1000000-0030-0000-0000-000000000000', 2, 1),
  ('c2000000-00a1-0000-0000-000000000000', 'เสื้อแขนสั้น', 'womens-tshirts', 'women/clothing/tshirts', 'c1000000-0030-0000-0000-000000000000', 2, 2),
  ('c2000000-00a2-0000-0000-000000000000', 'กางเกงเลกกิ้ง', 'womens-leggings', 'women/clothing/leggings', 'c1000000-0030-0000-0000-000000000000', 2, 3),
  ('c2000000-00a3-0000-0000-000000000000', 'แจ็คเก็ต', 'womens-jackets', 'women/clothing/jackets', 'c1000000-0030-0000-0000-000000000000', 2, 4);

-- Level 2 under ผู้หญิง > รองเท้า
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00a4-0000-0000-000000000000', 'รองเท้าวิ่ง', 'womens-running-shoes', 'women/shoes/running', 'c1000000-0031-0000-0000-000000000000', 2, 1),
  ('c2000000-00a5-0000-0000-000000000000', 'รองเท้าเทรนนิ่ง', 'womens-training-shoes', 'women/shoes/training', 'c1000000-0031-0000-0000-000000000000', 2, 2),
  ('c2000000-00a6-0000-0000-000000000000', 'รองเท้าเดิน', 'womens-walking-shoes', 'women/shoes/walking', 'c1000000-0031-0000-0000-000000000000', 2, 3);

-- Level 2 under ผู้หญิง > อุปกรณ์เสริม
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00a7-0000-0000-000000000000', 'กระเป๋า', 'womens-bags', 'women/accessories/bags', 'c1000000-0032-0000-0000-000000000000', 2, 1),
  ('c2000000-00a8-0000-0000-000000000000', 'ถุงเท้า', 'womens-socks', 'women/accessories/socks', 'c1000000-0032-0000-0000-000000000000', 2, 2),
  ('c2000000-00a9-0000-0000-000000000000', 'หมวก', 'womens-hats', 'women/accessories/hats', 'c1000000-0032-0000-0000-000000000000', 2, 3);

-- Level 1 under เด็ก
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c1000000-0040-0000-0000-000000000000', 'เสื้อผ้าเด็ก', 'kids-clothing', 'kids/clothing', 'c0000000-0004-0000-0000-000000000000', 1, 1),
  ('c1000000-0041-0000-0000-000000000000', 'รองเท้าเด็ก', 'kids-shoes', 'kids/shoes', 'c0000000-0004-0000-0000-000000000000', 1, 2),
  ('c1000000-0042-0000-0000-000000000000', 'ของเล่นกลางแจ้ง', 'kids-outdoor-toys', 'kids/outdoor-toys', 'c0000000-0004-0000-0000-000000000000', 1, 3);

-- Level 2 under เด็ก > เสื้อผ้าเด็ก
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00b0-0000-0000-000000000000', 'เสื้อยืด', 'kids-tshirts', 'kids/clothing/tshirts', 'c1000000-0040-0000-0000-000000000000', 2, 1),
  ('c2000000-00b1-0000-0000-000000000000', 'กางเกง', 'kids-pants', 'kids/clothing/pants', 'c1000000-0040-0000-0000-000000000000', 2, 2),
  ('c2000000-00b2-0000-0000-000000000000', 'ชุดว่ายน้ำ', 'kids-swimwear', 'kids/clothing/swimwear', 'c1000000-0040-0000-0000-000000000000', 2, 3);

-- Level 2 under เด็ก > รองเท้าเด็ก
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00b3-0000-0000-000000000000', 'รองเท้าผ้าใบ', 'kids-sneakers', 'kids/shoes/sneakers', 'c1000000-0041-0000-0000-000000000000', 2, 1),
  ('c2000000-00b4-0000-0000-000000000000', 'รองเท้าแตะ', 'kids-sandals', 'kids/shoes/sandals', 'c1000000-0041-0000-0000-000000000000', 2, 2),
  ('c2000000-00b5-0000-0000-000000000000', 'รองเท้ากีฬา', 'kids-sport-shoes', 'kids/shoes/sport', 'c1000000-0041-0000-0000-000000000000', 2, 3);

-- Level 2 under เด็ก > ของเล่นกลางแจ้ง
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00b6-0000-0000-000000000000', 'สกูตเตอร์', 'kids-scooter', 'kids/outdoor-toys/scooter', 'c1000000-0042-0000-0000-000000000000', 2, 1),
  ('c2000000-00b7-0000-0000-000000000000', 'จักรยานเด็ก', 'kids-bicycle', 'kids/outdoor-toys/bicycle', 'c1000000-0042-0000-0000-000000000000', 2, 2),
  ('c2000000-00b8-0000-0000-000000000000', 'ลูกบอล', 'kids-balls', 'kids/outdoor-toys/balls', 'c1000000-0042-0000-0000-000000000000', 2, 3);

-- Level 1 under อุปกรณ์เสริมอื่นๆ
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c1000000-0050-0000-0000-000000000000', 'กระเป๋า', 'acc-bags', 'accessories/bags', 'c0000000-0005-0000-0000-000000000000', 1, 1),
  ('c1000000-0051-0000-0000-000000000000', 'อุปกรณ์ป้องกัน', 'acc-protection', 'accessories/protection', 'c0000000-0005-0000-0000-000000000000', 1, 2),
  ('c1000000-0052-0000-0000-000000000000', 'เทคโนโลยี', 'acc-tech', 'accessories/tech', 'c0000000-0005-0000-0000-000000000000', 1, 3);

-- Level 2 under อุปกรณ์เสริม > กระเป๋า
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00c0-0000-0000-000000000000', 'กระเป๋าเป้', 'acc-backpack', 'accessories/bags/backpack', 'c1000000-0050-0000-0000-000000000000', 2, 1),
  ('c2000000-00c1-0000-0000-000000000000', 'กระเป๋าสะพาย', 'acc-crossbody', 'accessories/bags/crossbody', 'c1000000-0050-0000-0000-000000000000', 2, 2),
  ('c2000000-00c2-0000-0000-000000000000', 'กระเป๋าเดินทาง', 'acc-luggage', 'accessories/bags/luggage', 'c1000000-0050-0000-0000-000000000000', 2, 3);

-- Level 2 under อุปกรณ์เสริม > อุปกรณ์ป้องกัน
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00c3-0000-0000-000000000000', 'หมวกกันน็อค', 'acc-helmet', 'accessories/protection/helmet', 'c1000000-0051-0000-0000-000000000000', 2, 1),
  ('c2000000-00c4-0000-0000-000000000000', 'สนับเข่า', 'acc-kneepad', 'accessories/protection/kneepad', 'c1000000-0051-0000-0000-000000000000', 2, 2),
  ('c2000000-00c5-0000-0000-000000000000', 'ถุงมือ', 'acc-gloves', 'accessories/protection/gloves', 'c1000000-0051-0000-0000-000000000000', 2, 3);

-- Level 2 under อุปกรณ์เสริม > เทคโนโลยี
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00c6-0000-0000-000000000000', 'นาฬิกาสมาร์ทวอทช์', 'acc-smartwatch', 'accessories/tech/smartwatch', 'c1000000-0052-0000-0000-000000000000', 2, 1),
  ('c2000000-00c7-0000-0000-000000000000', 'ไฟฉาย', 'acc-flashlight', 'accessories/tech/flashlight', 'c1000000-0052-0000-0000-000000000000', 2, 2),
  ('c2000000-00c8-0000-0000-000000000000', 'กล้องแอคชั่น', 'acc-actioncam', 'accessories/tech/actioncam', 'c1000000-0052-0000-0000-000000000000', 2, 3);

-- Level 1 under สำหรับท่องเที่ยว
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c1000000-0060-0000-0000-000000000000', 'แคมป์ปิ้ง', 'travel-camping', 'travel/camping', 'c0000000-0006-0000-0000-000000000000', 1, 1),
  ('c1000000-0061-0000-0000-000000000000', 'เดินป่า', 'travel-hiking', 'travel/hiking', 'c0000000-0006-0000-0000-000000000000', 1, 2),
  ('c1000000-0062-0000-0000-000000000000', 'ท่องเที่ยวทะเล', 'travel-beach', 'travel/beach', 'c0000000-0006-0000-0000-000000000000', 1, 3);

-- Level 2 under ท่องเที่ยว > แคมป์ปิ้ง
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00d0-0000-0000-000000000000', 'เต็นท์', 'travel-tents', 'travel/camping/tents', 'c1000000-0060-0000-0000-000000000000', 2, 1),
  ('c2000000-00d1-0000-0000-000000000000', 'ถุงนอน', 'travel-sleeping-bags', 'travel/camping/sleeping-bags', 'c1000000-0060-0000-0000-000000000000', 2, 2),
  ('c2000000-00d2-0000-0000-000000000000', 'เก้าอี้พับ', 'travel-chairs', 'travel/camping/chairs', 'c1000000-0060-0000-0000-000000000000', 2, 3),
  ('c2000000-00d3-0000-0000-000000000000', 'โคมไฟ', 'travel-lanterns', 'travel/camping/lanterns', 'c1000000-0060-0000-0000-000000000000', 2, 4);

-- Level 2 under ท่องเที่ยว > เดินป่า
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00d4-0000-0000-000000000000', 'รองเท้าเดินป่า', 'travel-hiking-shoes', 'travel/hiking/shoes', 'c1000000-0061-0000-0000-000000000000', 2, 1),
  ('c2000000-00d5-0000-0000-000000000000', 'ไม้เท้า', 'travel-trekking-poles', 'travel/hiking/poles', 'c1000000-0061-0000-0000-000000000000', 2, 2),
  ('c2000000-00d6-0000-0000-000000000000', 'กระเป๋าเป้', 'travel-hiking-backpack', 'travel/hiking/backpack', 'c1000000-0061-0000-0000-000000000000', 2, 3);

-- Level 2 under ท่องเที่ยว > ทะเล
INSERT INTO categories (id, name, slug, route_path, parent_id, level, sort_order) VALUES
  ('c2000000-00d7-0000-0000-000000000000', 'ชุดดำน้ำ', 'travel-snorkel', 'travel/beach/snorkel', 'c1000000-0062-0000-0000-000000000000', 2, 1),
  ('c2000000-00d8-0000-0000-000000000000', 'ครีมกันแดด', 'travel-sunscreen', 'travel/beach/sunscreen', 'c1000000-0062-0000-0000-000000000000', 2, 2),
  ('c2000000-00d9-0000-0000-000000000000', 'กระเป๋ากันน้ำ', 'travel-waterproof-bag', 'travel/beach/waterproof-bag', 'c1000000-0062-0000-0000-000000000000', 2, 3);

-- ============================================
-- PRODUCTS - DealsCarousel (12 items - exact names from frontend)
-- ============================================
INSERT INTO products (id, name, slug, price, original_price, brand, sku, category_id, images, tags, stock, is_active, is_new, discount_label, rating, review_count) VALUES
  ('a0000000-0001-0000-0000-000000000000', 'เก้าอี้สนามพับได้สำหรับการตั้งแคมป์ รุ่น BASIC', 'camping-chair-basic', 550, NULL, 'QUECHUA', 'QUE-CHAIR-BAS', 'c2000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/1/400/400"]'::JSONB, '["ซื้อชิ้นที่ 2 ลด 50%"]'::JSONB, 200, TRUE, FALSE, 'ซื้อชิ้นที่ 2 ลด 50%', 4.8, 14962),
  ('a0000000-0002-0000-0000-000000000000', 'กระเป๋า เป้ เดินป่า ขนาด 38 ลิตร รุ่น MH500', 'hiking-backpack-mh500-38l', 1980, 2200, 'QUECHUA', 'QUE-BACK-MH500', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/10/400/400"]'::JSONB, '["Sale"]'::JSONB, 80, TRUE, FALSE, 'Sale -10%', 4.8, 7705),
  ('a0000000-0003-0000-0000-000000000000', 'ที่นอนสำหรับ 1 คนใช้ในการตั้งแคมป์ รุ่น AIR BASIC ขนาด 70 ซม.', 'camping-mattress-air-basic-70', 399, 699, 'QUECHUA', 'QUE-MAT-AIR70', 'c2000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/20/400/400"]'::JSONB, '["Sale"]'::JSONB, 350, TRUE, FALSE, 'Sale -33%', 4.5, 3787),
  ('a0000000-0004-0000-0000-000000000000', 'หมวกเปียก ผู้ชาย สีเขียว สำหรับเดินป่า', 'mens-hiking-hat-green', 300, 460, 'SOLOGNAC', 'SOL-HAT-GRN', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/30/400/400"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 120, TRUE, TRUE, NULL, 4.7, 9926),
  ('a0000000-0005-0000-0000-000000000000', 'หมวกกันน้ำสำหรับตั้งแคมป์ รุ่น TREK 900 สีกาดอลีฟ', 'trek-900-hat-olive', 490, 550, 'FORCLAZ', 'FOR-HAT-T900', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/40/400/400"]'::JSONB, '["กันน้ำ"]'::JSONB, 180, TRUE, FALSE, NULL, 4.8, 2976),
  ('a0000000-0006-0000-0000-000000000000', 'เสื้อแจ็คเก็ต กันลม กันฝน สำหรับผู้ชาย รุ่น NH550', 'mens-rain-jacket-nh550', 1150, 1650, 'QUECHUA', 'QUE-JACK-NH550', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/48/400/400"]'::JSONB, '["Sale"]'::JSONB, 90, TRUE, FALSE, 'Sale -38%', 4.9, 734),
  ('a0000000-0007-0000-0000-000000000000', 'ชุดไม้ ชิคเทนเนส 2 ไม้ และลูกเทนนิส รุ่น PI', 'beach-tennis-set-pi', 990, 2500, 'DECATHLON', 'DEC-TENNIS-PI', 'c2000000-0041-0000-0000-000000000000', '["https://picsum.photos/id/50/400/400"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 250, TRUE, TRUE, 'Sale -60%', 4.9, 64),
  ('a0000000-0008-0000-0000-000000000000', 'ถุงนอนผ้าฝ้ายสำหรับตั้งแคมป์ อุณหภูมิ 20°C', 'sleeping-bag-cotton-20c', 450, 590, 'QUECHUA', 'QUE-SLEEP-20C', 'c2000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/60/400/400"]'::JSONB, '["Sale"]'::JSONB, 400, TRUE, FALSE, 'Sale -24%', 4.6, 8523),
  ('a0000000-0009-0000-0000-000000000000', 'รองเท้าเดินป่ากันน้ำ สำหรับผู้ชาย รุ่น MH500', 'hiking-shoes-mh500-waterproof', 1690, 1990, 'QUECHUA', 'QUE-SHOE-MH500', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/70/400/400"]'::JSONB, '["กันน้ำ", "Sale"]'::JSONB, 150, TRUE, FALSE, 'Sale -15%', 4.7, 12450),
  ('a0000000-0010-0000-0000-000000000000', 'เสื่อโยคะขนาด 180 x 60 ซม. หนา 8 มม.', 'yoga-mat-180x60-8mm', 299, 450, 'DOMYOS', 'DOM-YOGA-180', 'c2000000-0012-0000-0000-000000000000', '["https://picsum.photos/id/80/400/400"]'::JSONB, '["Sale"]'::JSONB, 500, TRUE, FALSE, 'Sale -34%', 4.5, 6782),
  ('a0000000-0011-0000-0000-000000000000', 'กระบอกน้ำสแตนเลส เก็บอุณหภูมิ 0.7 ลิตร', 'stainless-bottle-07l', 350, NULL, 'QUECHUA', 'QUE-BOT-SS07', 'c2000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/216/400/400"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 300, TRUE, TRUE, NULL, 4.8, 3240),
  ('a0000000-0012-0000-0000-000000000000', 'ลูกฟุตบอลไฮบริด F500 ขนาดเบอร์ 5', 'hybrid-football-f500-size5', 490, 590, 'KIPSTA', 'KIP-BALL-F500', 'c2000000-0070-0000-0000-000000000000', '["https://picsum.photos/id/217/400/400"]'::JSONB, '[]'::JSONB, 200, TRUE, FALSE, 'Sale -17%', 4.6, 9871);

-- ============================================
-- PRODUCTS - FitnessCategorySection (8 items - exact names)
-- ============================================
INSERT INTO products (id, name, slug, price, brand, sku, category_id, images, tags, stock, is_active, is_new, rating, review_count) VALUES
  ('a0000000-0101-0000-0000-000000000000', 'แถบยางยืดออกกำลังกายเซต 3 ชิ้น แรงต้าน 10, 20 และ 30 กิโลกรัม', 'resistance-band-set-3', 700, 'DOMYOS', 'DOM-BAND-SET3', 'c2000000-0013-0000-0000-000000000000', '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 100, TRUE, TRUE, 4.8, 154),
  ('a0000000-0102-0000-0000-000000000000', 'ตุ้มน้ำหนักปรับได้สำหรับการออกแรง นั่งและยกครอสเทรนนิ่ง 12-24 กิโลกรัม', 'adjustable-dumbbell-12-24kg', 2550, 'DOMYOS', 'DOM-DB-ADJ-24', 'c2000000-0011-0000-0000-000000000000', '["https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&h=600&fit=crop"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 30, TRUE, TRUE, 4.7, 124),
  ('a0000000-0103-0000-0000-000000000000', 'ลู่วิ่งไฟฟ้า 220 โวลต์รุ่น Run 700', 'treadmill-run-700', 29000, 'DOMYOS', 'DOM-TREAD-700', 'c2000000-0010-0000-0000-000000000000', '["https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 15, TRUE, FALSE, 4.7, 24),
  ('a0000000-0104-0000-0000-000000000000', 'กระเป๋าอุปกรณ์เทรนนิ่งขนาดใหญ่ เทรนนิ่งขนาด 30 ลิตร (สีดำ)', 'training-bag-30l-black', 1950, 'DOMYOS', 'DOM-BAG-30L', 'c2000000-0014-0000-0000-000000000000', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 40, TRUE, FALSE, 4.9, 106),
  ('a0000000-0105-0000-0000-000000000000', 'เสื้อกล้าม แขนสั้น เว้าหลัง สำหรับผู้หญิง (สีน้ำเงินอ่อน)', 'womens-tank-top-light-blue', 320, 'DOMYOS', 'DOM-TANK-WM-BLU', 'c2000000-0015-0000-0000-000000000000', '["https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 500, TRUE, FALSE, 4.8, 76),
  ('a0000000-0106-0000-0000-000000000000', 'กางเกงออกกำลังกายขายาวอากาศ ใส่สบาย สำหรับผู้ชาย (สีดำ)', 'mens-fitness-pants-black', 159, 'DOMYOS', 'DOM-PANT-M-BLK', 'c2000000-0014-0000-0000-000000000000', '["https://images.unsplash.com/photo-1515775538093-d2d95c71bd48?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 600, TRUE, FALSE, 4.8, 17470),
  ('a0000000-0107-0000-0000-000000000000', 'เครื่องออกกำลังกาย 3-in-1 มัลติฟังก์ชั่น สำหรับผู้ชาย (สีดำ)', 'multi-gym-3in1-black', 30000, 'DOMYOS', 'DOM-MULTI-3IN1', 'c2000000-0010-0000-0000-000000000000', '["https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 10, TRUE, FALSE, 4.7, 473),
  ('a0000000-0108-0000-0000-000000000000', 'เสื่อโยคะ Comfort ขนาด 173 x 61 ซม. หนา 8 มม. สีม่วง', 'yoga-mat-comfort-173x61-purple', 399, 'KIMJALY', 'KIM-YOGA-COMF', 'c2000000-0012-0000-0000-000000000000', '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 250, TRUE, FALSE, 4.6, 8920);

-- ============================================
-- PRODUCTS - RunningCategorySection (8 items - exact names)
-- ============================================
INSERT INTO products (id, name, slug, price, brand, sku, category_id, images, tags, stock, is_active, is_new, rating, review_count) VALUES
  ('a0000000-0201-0000-0000-000000000000', 'รองเท้าวิ่งเสริมแผ่นคาร์บอนสำหรับผู้ชายรุ่น Kipstorm Elite (สีขาว/ชมพู)', 'kipstorm-elite-running', 5200, 'KIPRUN', 'KIP-RUN-ELITE', 'c3000000-0001-0000-0000-000000000000',
    '["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop","https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop","https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop","https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop"]'::JSONB,
    '["สินค้าใหม่"]'::JSONB, 100, TRUE, TRUE, 4.8, 48),
  ('a0000000-0202-0000-0000-000000000000', 'รองเท้าวิ่งเทรล สำหรับผู้ชาย Kipsummit Max (สีเหลือง)', 'kipsummit-max-trail', 3600, 'KIPRUN', 'KIP-TRAIL-MAX', 'c3000000-0001-0000-0000-000000000000', '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 80, TRUE, FALSE, 4.3, 241),
  ('a0000000-0203-0000-0000-000000000000', 'กางเกงรัดรูป/วิ่งเทรลอาชีพน้ำหนักเบา สำหรับผู้หญิงรุ่น Run 900 Light', 'womens-run-900-light-tights', 650, 'KIPRUN', 'KIP-TIGHT-W900', 'c3000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/91/600/600"]'::JSONB, '[]'::JSONB, 300, TRUE, FALSE, 4.8, 502),
  ('a0000000-0204-0000-0000-000000000000', 'เสื้อ แขนสั้น กันลม กันแดด สำหรับผู้ชาย รุ่น WIND 100 (สีน้ำเงิน)', 'mens-wind-100-tee-blue', 450, 'KIPRUN', 'KIP-TEE-W100', 'c3000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/64/600/600"]'::JSONB, '[]'::JSONB, 400, TRUE, FALSE, 4.9, 108),
  ('a0000000-0205-0000-0000-000000000000', 'หมวกแก็ปไวเซอร์ Unisex เวอร์ชั่น 2 (สีดำ)', 'visor-cap-v2-black', 250, 'KIPRUN', 'KIP-CAP-VIS2', 'c3000000-0003-0000-0000-000000000000', '["https://picsum.photos/id/58/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 600, TRUE, TRUE, 4.8, 2364),
  ('a0000000-0206-0000-0000-000000000000', 'สมาร์ทวอทช์สำหรับนักกีฬาพร้อม GPS รุ่น Fit 100 S', 'smartwatch-fit-100s', 1600, 'DECATHLON', 'DEC-WATCH-F100', 'c3000000-0003-0000-0000-000000000000', '["https://picsum.photos/id/175/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 50, TRUE, TRUE, 4.3, 389),
  ('a0000000-0207-0000-0000-000000000000', 'กระเป๋า เป้ วิ่งเทรล สะพายหลัง ขนาด 10 ลิตร', 'trail-running-vest-10l', 1100, 'KIPRUN', 'KIP-VEST-10L', 'c3000000-0003-0000-0000-000000000000', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 70, TRUE, TRUE, 4.9, 117),
  ('a0000000-0208-0000-0000-000000000000', 'กางเกงวิ่งขาสั้น Breathable สำหรับผู้ชาย Run Dry+', 'mens-run-dry-plus-shorts', 390, 'KALENJI', 'KAL-SHORT-DRY+', 'c3000000-0001-0000-0000-000000000000', '["https://images.unsplash.com/photo-1515775538093-d2d95c71bd48?w=600&h=600&fit=crop"]'::JSONB, '[]'::JSONB, 200, TRUE, FALSE, 4.7, 8450);

-- Set full details for Kipstorm Elite (main product detail page)
UPDATE products SET
  colors = '[{"name":"ขาว/ชมพู","hex":"#f5f0f0"}]'::JSONB,
  sizes = '["39","40","41","42","43","44","45"]'::JSONB,
  description = 'รองเท้ารุ่น Kipstorm คือคำตอบเพื่อการแข่งขัน มาพร้อมโฟม Fastech+ เพื่อให้แรงส่งและความสบายเต็มเปี่ยมสำหรับทุกการแข่งขัน ไม่ว่าจะเป็นฮาล์ฟมาราธอนหรือมาราธอน',
  description_full = 'ออกแบบมาเพื่อตอบสนองจินตนาการของคุณ โดยเฉพาะ Méline Rollin และ Jimmy Gressier ด้วยแผ่นคาร์บอน น้ำหนักเบา และดูดซับแรงกระแทกจากทุกประเภทและสนามไส่',
  benefits = '["แรงสะท้อนกลับ: โฟม Fastech+ ให้แรงส่งและการส่งคืนพลังงานเต็มเปี่ยม","น้ำหนักเบา: เพียง 215 กรัม (ขนาด 42) ช่วยลดความเหนื่อยล้า","รองรับแรงกระแทก: โฟม Fastech+ ปกป้องยาวนานระดับมาราธอน","สะดวกสบาย: ส่วนบนถักและพื้นรองเท้ามินิมอล ไม่เกิดเสียดสี"]'::JSONB,
  specifications = '{"น้ำหนัก":"215 กรัม (เบอร์ 42)","Drop":"8 มม.","พื้นรองเท้า":"Fastech+ foam","แผ่นรองรับ":"Carbon Fiber Plate","พื้นนอก":"Rubber Outsole"}'::JSONB
WHERE id = 'a0000000-0201-0000-0000-000000000000';

-- ============================================
-- PRODUCTS - Product Detail related (6 items - exact names)
-- ============================================
INSERT INTO products (id, name, slug, price, brand, sku, category_id, images, tags, stock, is_active, rating, review_count, colors, sizes) VALUES
  ('a0000000-0301-0000-0000-000000000000', 'รองเท้าวิ่งสำหรับผู้ชายรุ่น RUN 100 (สีเทา)', 'mens-run-100-grey', 399, 'DECATHLON', 'DEC-RUN-100', 'c3000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/21/400/400"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 120, TRUE, 4.5, 1250, '[]'::JSONB, '["39","40","41","42","43","44","45"]'::JSONB),
  ('a0000000-0302-0000-0000-000000000000', 'รองเท้าวิ่งเทรลสำหรับผู้ชายรุ่น PS 990 Dynamic (สีน้ำเงิน/ส้ม)', 'mens-trail-ps990-dynamic', 2500, 'KUIKMA', 'KUI-TRAIL-990', 'c3000000-0001-0000-0000-000000000000', '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop"]'::JSONB, '[]'::JSONB, 60, TRUE, 4.3, 241, '[]'::JSONB, '[]'::JSONB),
  ('a0000000-0303-0000-0000-000000000000', 'รองเท้าวิ่งสำหรับผู้ชายรุ่น JOGFLOW 100.1 (สีดำ/เทา)', 'mens-jogflow-1001', 599, 'KALENJI', 'KAL-JOG-1001', 'c3000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/96/400/400"]'::JSONB, '["กันน้ำ"]'::JSONB, 150, TRUE, 4.8, 502, '[]'::JSONB, '["39","40","41","42","43","44"]'::JSONB),
  ('a0000000-0304-0000-0000-000000000000', 'รองเท้าบูทเดินป่าเทรคกิ้งหนักบึกบึน สำหรับผู้ชายรุ่น MT500', 'mens-trekking-boot-mt500', 4800, 'SIMOND', 'SIM-BOOT-MT500', 'c2000000-0003-0000-0000-000000000000', '["https://picsum.photos/id/160/400/400"]'::JSONB, '[]'::JSONB, 40, TRUE, 4.9, 108, '[]'::JSONB, '["39","40","41","42","43","44","45"]'::JSONB),
  ('a0000000-0305-0000-0000-000000000000', 'รองเท้า เดินป่า ข้อต่ำ กันน้ำ สำหรับผู้ชาย รุ่น MH900 (สีดำ)', 'mens-hiking-mh900-waterproof', 3200, 'QUECHUA', 'QUE-SHOE-MH900', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/119/400/400"]'::JSONB, '[]'::JSONB, 80, TRUE, 4.7, 2364, '[]'::JSONB, '[]'::JSONB),
  ('a0000000-0306-0000-0000-000000000000', 'รองเท้าเดินป่าเทรคกิ้งหนักบึกบึน สำหรับผู้ชายรุ่น MT100 (สีดำ)', 'mens-trekking-mt100-black', 3200, 'QUECHUA', 'QUE-SHOE-MT100', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/103/400/400"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 70, TRUE, 4.6, 389, '[]'::JSONB, '[]'::JSONB);

-- Bundle items (for product detail page)
INSERT INTO products (id, name, slug, price, brand, sku, category_id, images, tags, stock, is_active, rating, review_count) VALUES
  ('a0000000-0311-0000-0000-000000000000', 'ถุงเท้าไวเซอร์รุ่น Run 100 แพ็ค 3 คู่ (สีดำ)', 'running-socks-run100-3pack', 79, 'KIPRUN', 'KIP-SOCK-R100', 'c3000000-0003-0000-0000-000000000000', '["https://picsum.photos/id/103/200/200"]'::JSONB, '[]'::JSONB, 800, TRUE, 4.7, 25979);

-- ============================================
-- PRODUCTS - SearchOverlay popular (8 items - exact names)
-- ============================================
INSERT INTO products (id, name, slug, price, brand, sku, category_id, images, tags, stock, is_active, is_new, rating, review_count) VALUES
  ('a0000000-0401-0000-0000-000000000000', 'เสื้อโปโลผู้ชาย UPF50+ แขนยาว', 'mens-polo-upf50-longsleeve', 300, 'SPORTGEAR', 'SG-POLO-UPF50', 'c1000000-0020-0000-0000-000000000000', '["https://picsum.photos/id/7/300/300"]'::JSONB, '[]'::JSONB, 200, TRUE, TRUE, 4.8, 355),
  ('a0000000-0402-0000-0000-000000000000', 'ถุงเท้าวิ่งรุ่น Run 100 แพ็ค 3 คู่', 'running-socks-run100-3pk', 79, 'KIPRUN', 'KIP-SOCK-R100-3', 'c3000000-0003-0000-0000-000000000000', '["https://picsum.photos/id/21/300/300"]'::JSONB, '[]'::JSONB, 800, TRUE, FALSE, 4.7, 25979),
  ('a0000000-0403-0000-0000-000000000000', 'กระเป๋าคาดอกวิ่ง KIPRUN', 'kiprun-chest-bag', 190, 'KIPRUN', 'KIP-CHEST-RUN', 'c3000000-0003-0000-0000-000000000000', '["https://picsum.photos/id/3/300/300"]'::JSONB, '[]'::JSONB, 150, TRUE, TRUE, 4.8, 11488),
  ('a0000000-0404-0000-0000-000000000000', 'กางเกงวิ่งสั้นสำหรับผู้ชาย Kiprun Run 100', 'mens-kiprun-run100-shorts', 169, 'KIPRUN', 'KIP-SHORT-R100', 'c3000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/6/300/300"]'::JSONB, '[]'::JSONB, 350, TRUE, FALSE, 4.7, 5715),
  ('a0000000-0405-0000-0000-000000000000', 'เสื้อแจ็คเก็ต กันลม กันฝน สำหรับผู้ชาย', 'mens-windbreaker-jacket', 450, 'KIPRUN', 'KIP-JACK-WIND', 'c1000000-0020-0000-0000-000000000000', '["https://picsum.photos/id/26/300/300"]'::JSONB, '[]'::JSONB, 100, TRUE, FALSE, 4.9, 108),
  ('a0000000-0406-0000-0000-000000000000', 'กางเกงออกกำลังกายขายาว สำหรับผู้ชาย', 'mens-workout-pants-long', 159, 'DOMYOS', 'DOM-PANT-M-WRK', 'c2000000-0014-0000-0000-000000000000', '["https://picsum.photos/id/65/300/300"]'::JSONB, '[]'::JSONB, 500, TRUE, FALSE, 4.8, 17470),
  ('a0000000-0407-0000-0000-000000000000', 'กางเกงขาสั้นสำหรับผู้ชาย Essential', 'mens-essential-shorts', 159, 'KUIKMA', 'KUI-SHORT-ESS', 'c2000000-0091-0000-0000-000000000000', '["https://picsum.photos/id/36/300/300"]'::JSONB, '[]'::JSONB, 600, TRUE, FALSE, 4.7, 5169),
  ('a0000000-0408-0000-0000-000000000000', 'กางเกงบ็อกเซอร์ไร้รอยตะเข็บ ผู้ชาย', 'mens-seamless-boxer', 130, 'KALENJI', 'KAL-BOXER-SML', 'c2000000-0090-0000-0000-000000000000', '["https://picsum.photos/id/42/300/300"]'::JSONB, '[]'::JSONB, 700, TRUE, FALSE, 4.7, 18175);

-- ============================================
-- PRODUCTS - Cart page items (3 - exact names)
-- ============================================
INSERT INTO products (id, name, slug, price, original_price, brand, sku, category_id, images, tags, stock, is_active, rating, review_count, colors, sizes) VALUES
  ('a0000000-0501-0000-0000-000000000000', 'หมวกกันน้ำสำหรับเดินป่ารุ่น TREK 900 สีกาดอลีฟ', 'trek-900-hat-olive-cart', 490, 550, 'FORCLAZ', 'FOR-HAT-T900C', 'c2000000-0002-0000-0000-000000000000', '["https://picsum.photos/id/58/300/300"]'::JSONB, '[]'::JSONB, 100, TRUE, 4.8, 2976, '[{"name":"เขตร้อนลมอุ่น,เขตทางตะวันตก","hex":"#556B2F"}]'::JSONB, '["60-62 ซม."]'::JSONB),
  ('a0000000-0502-0000-0000-000000000000', 'ที่นอนสำหรับ 1 คนใช้ในการตั้งแคมป์รุ่น AIR BASIC ขนาด 70 ซม.', 'camping-mattress-air-basic-70-cart', 399, 599, 'QUECHUA', 'QUE-MAT-AIR70C', 'c2000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/20/300/300"]'::JSONB, '["Sale"]'::JSONB, 200, TRUE, 4.5, 3787, '[{"name":"กรวดสีเบจ,เบคาจูสีไม้","hex":"#F5F5DC"}]'::JSONB, '["ไซส์เดียว"]'::JSONB),
  ('a0000000-0503-0000-0000-000000000000', 'ที่นอนเป่าลมสำหรับ 2 คนใช้ในการตั้งแคมป์รุ่น AIR BASIC ขนาด 140 ซม.', 'camping-mattress-air-basic-140-cart', 800, 1100, 'QUECHUA', 'QUE-MAT-AIR140C', 'c2000000-0001-0000-0000-000000000000', '["https://picsum.photos/id/30/300/300"]'::JSONB, '["Sale"]'::JSONB, 50, TRUE, 4.3, 89, '[{"name":"เวิร์กกรีนลิเบจ,ผ้าน้ำหยดเล็ก","hex":"#6B8E23"}]'::JSONB, '["ไซส์เดียว"]'::JSONB);

-- ============================================
-- BANNERS - Hero (5 - exact from HeroBanner.tsx)
-- ============================================
INSERT INTO banners (id, type, title, subtitle, hashtag, cta, image, link, sort_order) VALUES
  ('b1000000-0001-0000-0000-000000000000', 'hero', 'ENJOY THE RAIN', NULL, '#พร้อมลุยป่าหน้าฝน', 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&h=600&fit=crop', '/category/sports/outdoor', 1),
  ('b1000000-0002-0000-0000-000000000000', 'hero', 'TRAIN HARDER', NULL, '#ออกกำลังกายให้สุด', 'ช้อปเลย', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&h=600&fit=crop', '/category/sports/fitness', 2),
  ('b1000000-0003-0000-0000-000000000000', 'hero', 'DIVE INTO SUMMER', NULL, '#ว่ายน้ำสนุกหน้าร้อน', 'ดูสินค้า', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&h=600&fit=crop', '/category/sports/water-sports', 3),
  ('b1000000-0004-0000-0000-000000000000', 'hero', 'RIDE THE WAVE', NULL, '#ปั่นจักรยานท่องเที่ยว', 'สำรวจเพิ่มเติม', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&h=600&fit=crop', '/category/sports/cycling', 4),
  ('b1000000-0005-0000-0000-000000000000', 'hero', 'RUN YOUR WAY', NULL, '#วิ่งเปลี่ยนชีวิต', 'เริ่มต้นเลย', 'https://picsum.photos/id/29/1600/600', '/category/sports/running-walking', 5);

-- BANNERS - Fitness section (4 - exact from FitnessCategorySection.tsx)
INSERT INTO banners (id, type, title, subtitle, cta, image, link, section_key, sort_order) VALUES
  ('b1000000-0011-0000-0000-000000000000', 'category', 'เพาะกาย', NULL, 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop', '/category/sports/fitness/dumbbells', 'fitness', 1),
  ('b1000000-0012-0000-0000-000000000000', 'category', 'คาร์ดิโอ', NULL, 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&h=500&fit=crop', '/category/sports/fitness/machines', 'fitness', 2),
  ('b1000000-0013-0000-0000-000000000000', 'category', 'โฟลว์ไปกับทุกท่วงท่า', 'เมื่อโลกไม่หยุด', 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=500&fit=crop', '/category/sports/fitness/yoga-mats', 'fitness', 3),
  ('b1000000-0014-0000-0000-000000000000', 'category', 'เสริมความแข็งแรงจากข้างใน', 'พิลาทิสและซอฟต์เทรนนิ่ง', 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop', '/category/sports/fitness/resistance-bands', 'fitness', 4);

-- BANNERS - Running section (3 - exact from RunningCategorySection.tsx)
INSERT INTO banners (id, type, title, subtitle, cta, image, link, section_key, sort_order) VALUES
  ('b1000000-0021-0000-0000-000000000000', 'category', 'ก้าวข้ามทุกขีดจำกัด', 'วิ่ง', 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=500&fit=crop', '/category/sports/running-walking/running', 'running', 1),
  ('b1000000-0022-0000-0000-000000000000', 'category', 'พร้อมลุยทุกเส้นทาง', 'วิ่งเทรล', 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=800&h=500&fit=crop', '/category/sports/running-walking/trail', 'running', 2),
  ('b1000000-0023-0000-0000-000000000000', 'category', 'ฟื้นฟูร่างกายให้พร้อมลุย', 'ส่องไอเทมสุขภาพและโภชนาการ', 'ค้นหาเพิ่มเติม', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop', '/category/sports/running-walking/recovery', 'running', 3);

-- BANNERS - NavMenu promo (2)
INSERT INTO banners (id, type, title, subtitle, cta, image, section_key, sort_order) VALUES
  ('b1000000-0031-0000-0000-000000000000', 'promo', 'CLEARANCE SALE', 'สินค้าจำนวนจำกัด ลดสูงสุด 70%', 'ช้อปเลย', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=500&fit=crop', 'nav_promo', 1),
  ('b1000000-0032-0000-0000-000000000000', 'promo', 'เล่นกีฬาเล่นให้คุ้ม', 'กับเหตุผลที่ทุกคนเลือกสปอร์ตเกียร์', 'ดูเพิ่มเติม', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop', 'nav_promo', 2);

-- ============================================
-- PROMOTIONS (โปรโมชั่น / ดีล)
-- ============================================
INSERT INTO promotions (id, name, slug, description, type, discount_value, discount_label, start_date, end_date, sort_order) VALUES
  ('d1000000-0001-0000-0000-000000000000', 'ดีลเด็ด ห้ามพลาด!', 'hot-deals', 'สินค้าลดราคาประจำสัปดาห์', 'percentage', NULL, NULL, '2026-07-01', '2026-12-31', 1),
  ('d1000000-0002-0000-0000-000000000000', 'ซื้อชิ้นที่ 2 ลด 50%', 'buy-2nd-half', 'ซื้อสินค้าชิ้นที่ 2 ลดครึ่งราคา', 'buy_x_get_y', 50, 'ซื้อชิ้นที่ 2 ลด 50%', '2026-07-01', '2026-09-30', 2),
  ('d1000000-0003-0000-0000-000000000000', 'CLEARANCE SALE', 'clearance-sale', 'สินค้าจำนวนจำกัด ลดสูงสุด 70%', 'percentage', 70, 'Sale สูงสุด 70%', '2026-07-01', '2026-08-31', 3);

-- โปรฯ "ดีลเด็ด" → สินค้าที่ลดราคา (ราคาลดตั้งใน product เอง, override_label สำหรับแสดงป้าย)
INSERT INTO promotion_products (promotion_id, product_id, override_label, sort_order) VALUES
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0002-0000-0000-000000000000', 'Sale -10%', 1),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0003-0000-0000-000000000000', 'Sale -33%', 2),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0006-0000-0000-000000000000', 'Sale -38%', 3),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0007-0000-0000-000000000000', 'Sale -60%', 4),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0008-0000-0000-000000000000', 'Sale -24%', 5),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0009-0000-0000-000000000000', 'Sale -15%', 6),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0010-0000-0000-000000000000', 'Sale -34%', 7),
  ('d1000000-0001-0000-0000-000000000000', 'a0000000-0012-0000-0000-000000000000', 'Sale -17%', 8);

-- โปรฯ "ซื้อชิ้นที่ 2 ลด 50%" → สินค้าที่ร่วมรายการ
INSERT INTO promotion_products (promotion_id, product_id, override_label, sort_order) VALUES
  ('d1000000-0002-0000-0000-000000000000', 'a0000000-0001-0000-0000-000000000000', 'ซื้อชิ้นที่ 2 ลด 50%', 1),
  ('d1000000-0002-0000-0000-000000000000', 'a0000000-0004-0000-0000-000000000000', NULL, 2),
  ('d1000000-0002-0000-0000-000000000000', 'a0000000-0011-0000-0000-000000000000', NULL, 3);

-- ============================================
-- HOMEPAGE SECTIONS
-- ============================================
INSERT INTO homepage_sections (id, title, slug, type, category_id, sort_order) VALUES
  ('e1000000-0001-0000-0000-000000000000', 'สินค้าดีลสุดพิเศษ', 'hot-deals', 'deals', NULL, 1),
  ('e1000000-0002-0000-0000-000000000000', 'ค้นหาสินค้าฟิตเนส', 'fitness-products', 'category', 'c1000000-0002-0000-0000-000000000000', 2),
  ('e1000000-0003-0000-0000-000000000000', 'ค้นพบเรื่องการวิ่ง สุขภาพ และโภชนาการ', 'running-health', 'category', 'c1000000-0003-0000-0000-000000000000', 3);

-- Map products to sections
INSERT INTO homepage_section_products (section_id, product_id, sort_order) VALUES
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0001-0000-0000-000000000000', 1),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0002-0000-0000-000000000000', 2),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0003-0000-0000-000000000000', 3),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0004-0000-0000-000000000000', 4),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0005-0000-0000-000000000000', 5),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0006-0000-0000-000000000000', 6),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0007-0000-0000-000000000000', 7),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0008-0000-0000-000000000000', 8),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0009-0000-0000-000000000000', 9),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0010-0000-0000-000000000000', 10),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0011-0000-0000-000000000000', 11),
  ('e1000000-0001-0000-0000-000000000000', 'a0000000-0012-0000-0000-000000000000', 12);

INSERT INTO homepage_section_products (section_id, product_id, sort_order) VALUES
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0101-0000-0000-000000000000', 1),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0102-0000-0000-000000000000', 2),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0103-0000-0000-000000000000', 3),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0104-0000-0000-000000000000', 4),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0105-0000-0000-000000000000', 5),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0106-0000-0000-000000000000', 6),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0107-0000-0000-000000000000', 7),
  ('e1000000-0002-0000-0000-000000000000', 'a0000000-0108-0000-0000-000000000000', 8);

INSERT INTO homepage_section_products (section_id, product_id, sort_order) VALUES
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0201-0000-0000-000000000000', 1),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0202-0000-0000-000000000000', 2),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0203-0000-0000-000000000000', 3),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0204-0000-0000-000000000000', 4),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0205-0000-0000-000000000000', 5),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0206-0000-0000-000000000000', 6),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0207-0000-0000-000000000000', 7),
  ('e1000000-0003-0000-0000-000000000000', 'a0000000-0208-0000-0000-000000000000', 8);

-- ============================================
-- SUB CATEGORY ITEMS - Fitness section (10 icons)
-- ============================================
INSERT INTO sub_category_items (section_id, label, icon_name, link, sort_order) VALUES
  ('e1000000-0002-0000-0000-000000000000', 'เสื้อผ้าฟิตเนสผู้ชาย', 'Shirt', '/category/sports/fitness/mens-apparel', 1),
  ('e1000000-0002-0000-0000-000000000000', 'เสื้อผ้าฟิตเนสผู้หญิง', 'Shirt', '/category/sports/fitness/womens-apparel', 2),
  ('e1000000-0002-0000-0000-000000000000', 'เปรียบเทียบ', 'Dumbbell', '/category/sports/fitness', 3),
  ('e1000000-0002-0000-0000-000000000000', 'สูตร', 'Trophy', '/category/sports/fitness', 4),
  ('e1000000-0002-0000-0000-000000000000', 'เคลื่อนไหว', 'HeartPulse', '/category/sports/fitness', 5),
  ('e1000000-0002-0000-0000-000000000000', 'ยางยืด', 'Waves', '/category/sports/fitness/resistance-bands', 6),
  ('e1000000-0002-0000-0000-000000000000', 'ดัมเบล', 'Dumbbell', '/category/sports/fitness/dumbbells', 7),
  ('e1000000-0002-0000-0000-000000000000', 'แทรมโพลีน', 'Footprints', '/category/sports/fitness/machines', 8),
  ('e1000000-0002-0000-0000-000000000000', 'เชือกกระโดด', 'Bike', '/category/sports/fitness', 9),
  ('e1000000-0002-0000-0000-000000000000', 'อาหารเสริมและการฟื้นฟู', 'Apple', '/category/sports/fitness', 10);

-- SUB CATEGORY ITEMS - Running section (13 images - exact from frontend)
INSERT INTO sub_category_items (section_id, label, image, link, sort_order) VALUES
  ('e1000000-0003-0000-0000-000000000000', 'เสื้อวิ่ง', 'https://picsum.photos/id/64/200/200', '/category/sports/running-walking/running/apparel', 1),
  ('e1000000-0003-0000-0000-000000000000', 'กางเกงวิ่ง', 'https://picsum.photos/id/91/200/200', '/category/sports/running-walking/running/apparel', 2),
  ('e1000000-0003-0000-0000-000000000000', 'เสื้อเทคนิค', 'https://picsum.photos/id/160/200/200', '/category/sports/running-walking/running/apparel', 3),
  ('e1000000-0003-0000-0000-000000000000', 'รองเท้าวิ่ง', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', '/category/sports/running-walking/running/shoes', 4),
  ('e1000000-0003-0000-0000-000000000000', 'เป้น้ำวิ่งเทรล', 'https://picsum.photos/id/111/200/200', '/category/sports/running-walking/trail', 5),
  ('e1000000-0003-0000-0000-000000000000', 'อุปกรณ์เสริมสำหรับวิ่ง', 'https://picsum.photos/id/57/200/200', '/category/sports/running-walking/running/accessories', 6),
  ('e1000000-0003-0000-0000-000000000000', 'ถุงเท้า', 'https://picsum.photos/id/103/200/200', '/category/sports/running-walking/running/accessories', 7),
  ('e1000000-0003-0000-0000-000000000000', 'แว่นตาวิ่ง', 'https://picsum.photos/id/3/200/200', '/category/sports/running-walking/running/accessories', 8),
  ('e1000000-0003-0000-0000-000000000000', 'หมวก', 'https://picsum.photos/id/58/200/200', '/category/sports/running-walking/running/accessories', 9),
  ('e1000000-0003-0000-0000-000000000000', 'นาฬิกา', 'https://picsum.photos/id/175/200/200', '/category/sports/running-walking/running/accessories', 10),
  ('e1000000-0003-0000-0000-000000000000', 'ชุดวิ่ง', 'https://picsum.photos/id/177/200/200', '/category/sports/running-walking/running/apparel', 11),
  ('e1000000-0003-0000-0000-000000000000', 'โลชั่นอาร์นิก้า & แฟชั่นแอ่นเมือ', 'https://picsum.photos/id/63/200/200', '/category/sports/running-walking/recovery', 12),
  ('e1000000-0003-0000-0000-000000000000', 'ผลิตภัณฑ์กีฬา', 'https://picsum.photos/id/26/200/200', '/category/sports/running-walking', 13);

-- ============================================
-- CATEGORY SHORTCUTS (homepage - exact from CategoryShortcuts.tsx)
-- ============================================
INSERT INTO category_shortcuts (label, image, text_overlay, link, sort_order) VALUES
  ('ผู้ชาย', 'https://picsum.photos/id/91/200/200', NULL, '/category/men', 1),
  ('ผู้หญิง', 'https://picsum.photos/id/64/200/200', NULL, '/category/women', 2),
  ('เด็ก', 'https://picsum.photos/id/177/200/200', NULL, '/category/kids', 3),
  ('อุปกรณ์เสริมอื่นๆ', 'https://picsum.photos/id/111/200/200', NULL, '/category/accessories', 4),
  ('ประเภทกีฬา', 'https://picsum.photos/id/116/200/200', NULL, '/category/sports', 5),
  ('สินค้าสำหรับหน้าฝน', 'https://picsum.photos/id/119/200/200', NULL, '/category/sports/outdoor', 6),
  ('ดีลสุดพิเศษ', '', '%', '#deals', 7),
  ('สินค้ามาใหม่', '', 'NEW', '#new', 8),
  ('แบรนด์สปอร์ตเกียร์', '', 'SG', '#brands', 9),
  ('สำหรับการท่องเที่ยว', 'https://picsum.photos/id/15/200/200', NULL, '/category/travel', 10),
  ('เสื้อผ้าฝึกและไลฟ์สไตล์', 'https://picsum.photos/id/325/200/200', NULL, '/category/men/clothing', 11);

-- ============================================
-- ATTRIBUTE GROUPS (ประเภท attribute)
-- ============================================
INSERT INTO attribute_groups (id, name, slug, display_type, unit, sort_order) VALUES
  ('f1000000-0001-0000-0000-000000000000', 'ไซส์เสื้อผ้า', 'clothing-size', 'button', NULL, 1),
  ('f1000000-0002-0000-0000-000000000000', 'ไซส์รองเท้า', 'shoe-size', 'button', NULL, 2),
  ('f1000000-0003-0000-0000-000000000000', 'สี', 'color', 'color', NULL, 3),
  ('f1000000-0004-0000-0000-000000000000', 'ขนาดอุปกรณ์แคมป์ปิ้ง', 'camping-size', 'select', 'ซม.', 4),
  ('f1000000-0005-0000-0000-000000000000', 'ความหนาเสื่อ', 'mat-thickness', 'button', 'มม.', 5),
  ('f1000000-0006-0000-0000-000000000000', 'เบอร์ลูกบอล', 'ball-size', 'button', NULL, 6),
  ('f1000000-0007-0000-0000-000000000000', 'น้ำหนักดัมเบล', 'dumbbell-weight', 'select', 'กก.', 7),
  ('f1000000-0008-0000-0000-000000000000', 'ความจุ (ลิตร)', 'capacity-liter', 'select', 'ลิตร', 8),
  ('f1000000-0009-0000-0000-000000000000', 'ขนาดหมวก', 'hat-size', 'select', 'ซม.', 9),
  ('f1000000-0010-0000-0000-000000000000', 'แรงต้านยางยืด', 'resistance-level', 'button', 'กก.', 10),
  ('f1000000-0011-0000-0000-000000000000', 'ความจุกระบอกน้ำ', 'bottle-capacity', 'select', 'มล.', 11),
  ('f1000000-0012-0000-0000-000000000000', 'ไซส์ถุงเท้า', 'sock-size', 'button', NULL, 12);

-- ============================================
-- ATTRIBUTE OPTIONS
-- ============================================

-- ไซส์เสื้อผ้า
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0001-0000-0000-000000000000', 'XS', 'XS', 1),
  ('f1000000-0001-0000-0000-000000000000', 'S', 'S', 2),
  ('f1000000-0001-0000-0000-000000000000', 'M', 'M', 3),
  ('f1000000-0001-0000-0000-000000000000', 'L', 'L', 4),
  ('f1000000-0001-0000-0000-000000000000', 'XL', 'XL', 5),
  ('f1000000-0001-0000-0000-000000000000', '2XL', '2XL', 6),
  ('f1000000-0001-0000-0000-000000000000', '3XL', '3XL', 7);

-- ไซส์รองเท้า
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0002-0000-0000-000000000000', '36', '36', 1),
  ('f1000000-0002-0000-0000-000000000000', '37', '37', 2),
  ('f1000000-0002-0000-0000-000000000000', '38', '38', 3),
  ('f1000000-0002-0000-0000-000000000000', '39', '39', 4),
  ('f1000000-0002-0000-0000-000000000000', '40', '40', 5),
  ('f1000000-0002-0000-0000-000000000000', '41', '41', 6),
  ('f1000000-0002-0000-0000-000000000000', '42', '42', 7),
  ('f1000000-0002-0000-0000-000000000000', '43', '43', 8),
  ('f1000000-0002-0000-0000-000000000000', '44', '44', 9),
  ('f1000000-0002-0000-0000-000000000000', '45', '45', 10),
  ('f1000000-0002-0000-0000-000000000000', '46', '46', 11);

-- สี (ใช้ได้กับทุกประเภท)
INSERT INTO attribute_options (group_id, label, value, color_hex, sort_order) VALUES
  ('f1000000-0003-0000-0000-000000000000', 'ดำ', 'black', '#000000', 1),
  ('f1000000-0003-0000-0000-000000000000', 'ขาว', 'white', '#FFFFFF', 2),
  ('f1000000-0003-0000-0000-000000000000', 'กรมท่า', 'navy', '#1B2A4A', 3),
  ('f1000000-0003-0000-0000-000000000000', 'เทา', 'grey', '#808080', 4),
  ('f1000000-0003-0000-0000-000000000000', 'แดง', 'red', '#E53E3E', 5),
  ('f1000000-0003-0000-0000-000000000000', 'น้ำเงิน', 'blue', '#3182CE', 6),
  ('f1000000-0003-0000-0000-000000000000', 'เขียว', 'green', '#38A169', 7),
  ('f1000000-0003-0000-0000-000000000000', 'ส้ม', 'orange', '#DD6B20', 8),
  ('f1000000-0003-0000-0000-000000000000', 'ชมพู', 'pink', '#ED64A6', 9),
  ('f1000000-0003-0000-0000-000000000000', 'เหลือง', 'yellow', '#ECC94B', 10),
  ('f1000000-0003-0000-0000-000000000000', 'ม่วง', 'purple', '#805AD5', 11),
  ('f1000000-0003-0000-0000-000000000000', 'น้ำตาล', 'brown', '#8B4513', 12),
  ('f1000000-0003-0000-0000-000000000000', 'เบจ', 'beige', '#F5F5DC', 13),
  ('f1000000-0003-0000-0000-000000000000', 'ขาว/ชมพู', 'white-pink', '#F5F0F0', 14),
  ('f1000000-0003-0000-0000-000000000000', 'กาดอลีฟ', 'khaki-olive', '#556B2F', 15);

-- ขนาดอุปกรณ์แคมป์ปิ้ง (ที่นอน, ถุงนอน)
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0004-0000-0000-000000000000', '70 ซม. (1 คน)', '70', 1),
  ('f1000000-0004-0000-0000-000000000000', '120 ซม. (1.5 คน)', '120', 2),
  ('f1000000-0004-0000-0000-000000000000', '140 ซม. (2 คน)', '140', 3),
  ('f1000000-0004-0000-0000-000000000000', '200 ซม. (กว้างพิเศษ)', '200', 4);

-- ความหนาเสื่อ
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0005-0000-0000-000000000000', '4 มม.', '4', 1),
  ('f1000000-0005-0000-0000-000000000000', '5 มม.', '5', 2),
  ('f1000000-0005-0000-0000-000000000000', '6 มม.', '6', 3),
  ('f1000000-0005-0000-0000-000000000000', '8 มม.', '8', 4),
  ('f1000000-0005-0000-0000-000000000000', '10 มม.', '10', 5),
  ('f1000000-0005-0000-0000-000000000000', '15 มม.', '15', 6);

-- เบอร์ลูกบอล
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0006-0000-0000-000000000000', 'เบอร์ 1 (มินิ)', '1', 1),
  ('f1000000-0006-0000-0000-000000000000', 'เบอร์ 3 (เด็ก)', '3', 2),
  ('f1000000-0006-0000-0000-000000000000', 'เบอร์ 4 (เยาวชน)', '4', 3),
  ('f1000000-0006-0000-0000-000000000000', 'เบอร์ 5 (มาตรฐาน)', '5', 4);

-- น้ำหนักดัมเบล
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0007-0000-0000-000000000000', '1 กก.', '1', 1),
  ('f1000000-0007-0000-0000-000000000000', '2 กก.', '2', 2),
  ('f1000000-0007-0000-0000-000000000000', '3 กก.', '3', 3),
  ('f1000000-0007-0000-0000-000000000000', '5 กก.', '5', 4),
  ('f1000000-0007-0000-0000-000000000000', '8 กก.', '8', 5),
  ('f1000000-0007-0000-0000-000000000000', '10 กก.', '10', 6),
  ('f1000000-0007-0000-0000-000000000000', '12 กก.', '12', 7),
  ('f1000000-0007-0000-0000-000000000000', '15 กก.', '15', 8),
  ('f1000000-0007-0000-0000-000000000000', '20 กก.', '20', 9),
  ('f1000000-0007-0000-0000-000000000000', '24 กก.', '24', 10),
  ('f1000000-0007-0000-0000-000000000000', '30 กก.', '30', 11);

-- ความจุ (ลิตร) - กระเป๋า, เป้น้ำ
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0008-0000-0000-000000000000', '5 ลิตร', '5', 1),
  ('f1000000-0008-0000-0000-000000000000', '10 ลิตร', '10', 2),
  ('f1000000-0008-0000-0000-000000000000', '15 ลิตร', '15', 3),
  ('f1000000-0008-0000-0000-000000000000', '20 ลิตร', '20', 4),
  ('f1000000-0008-0000-0000-000000000000', '25 ลิตร', '25', 5),
  ('f1000000-0008-0000-0000-000000000000', '30 ลิตร', '30', 6),
  ('f1000000-0008-0000-0000-000000000000', '38 ลิตร', '38', 7),
  ('f1000000-0008-0000-0000-000000000000', '50 ลิตร', '50', 8),
  ('f1000000-0008-0000-0000-000000000000', '70 ลิตร', '70', 9);

-- ขนาดหมวก
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0009-0000-0000-000000000000', '54-56 ซม.', '54-56', 1),
  ('f1000000-0009-0000-0000-000000000000', '56-58 ซม.', '56-58', 2),
  ('f1000000-0009-0000-0000-000000000000', '58-60 ซม.', '58-60', 3),
  ('f1000000-0009-0000-0000-000000000000', '60-62 ซม.', '60-62', 4);

-- แรงต้านยางยืด
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0010-0000-0000-000000000000', '5 กก. (เบามาก)', '5', 1),
  ('f1000000-0010-0000-0000-000000000000', '10 กก. (เบา)', '10', 2),
  ('f1000000-0010-0000-0000-000000000000', '15 กก. (ปานกลาง)', '15', 3),
  ('f1000000-0010-0000-0000-000000000000', '20 กก. (หนัก)', '20', 4),
  ('f1000000-0010-0000-0000-000000000000', '25 กก. (หนักมาก)', '25', 5),
  ('f1000000-0010-0000-0000-000000000000', '30 กก. (หนักสุด)', '30', 6);

-- ความจุกระบอกน้ำ
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0011-0000-0000-000000000000', '350 มล.', '350', 1),
  ('f1000000-0011-0000-0000-000000000000', '500 มล.', '500', 2),
  ('f1000000-0011-0000-0000-000000000000', '700 มล.', '700', 3),
  ('f1000000-0011-0000-0000-000000000000', '750 มล.', '750', 4),
  ('f1000000-0011-0000-0000-000000000000', '1000 มล.', '1000', 5),
  ('f1000000-0011-0000-0000-000000000000', '1500 มล.', '1500', 6);

-- ไซส์ถุงเท้า
INSERT INTO attribute_options (group_id, label, value, sort_order) VALUES
  ('f1000000-0012-0000-0000-000000000000', '35-38', '35-38', 1),
  ('f1000000-0012-0000-0000-000000000000', '39-42', '39-42', 2),
  ('f1000000-0012-0000-0000-000000000000', '43-46', '43-46', 3);

-- ============================================
-- CATEGORY ↔ ATTRIBUTE GROUPS (เชื่อม category กับ attribute ที่ใช้ได้)
-- ============================================

-- เสื้อผ้าผู้ชาย → ไซส์เสื้อผ้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c1000000-0020-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c1000000-0020-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);
-- เสื้อผ้าผู้ชาย sub-categories
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0090-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0090-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2),
  ('c2000000-0091-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0091-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2),
  ('c2000000-0092-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0092-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2),
  ('c2000000-0093-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0093-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- เสื้อผ้าผู้หญิง → ไซส์เสื้อผ้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c1000000-0030-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c1000000-0030-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- เสื้อผ้าฟิตเนสชาย/หญิง → ไซส์เสื้อผ้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0014-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0014-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2),
  ('c2000000-0015-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0015-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- เสื้อผ้าวิ่ง → ไซส์เสื้อผ้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c3000000-0002-0000-0000-000000000000', 'f1000000-0001-0000-0000-000000000000', TRUE, 1),
  ('c3000000-0002-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- รองเท้าวิ่ง → ไซส์รองเท้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c3000000-0001-0000-0000-000000000000', 'f1000000-0002-0000-0000-000000000000', TRUE, 1),
  ('c3000000-0001-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- รองเท้าผู้ชาย/ผู้หญิง → ไซส์รองเท้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c1000000-0021-0000-0000-000000000000', 'f1000000-0002-0000-0000-000000000000', TRUE, 1),
  ('c1000000-0021-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2),
  ('c1000000-0031-0000-0000-000000000000', 'f1000000-0002-0000-0000-000000000000', TRUE, 1),
  ('c1000000-0031-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- รองเท้าเดินป่า/ปีนเขา → ไซส์รองเท้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0002-0000-0000-000000000000', 'f1000000-0002-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0002-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- อุปกรณ์แคมป์ปิ้ง (ที่นอน, ถุงนอน) → ขนาดอุปกรณ์ + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0001-0000-0000-000000000000', 'f1000000-0004-0000-0000-000000000000', FALSE, 1),
  ('c2000000-0001-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', FALSE, 2);

-- เสื่อโยคะ → ความหนา + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0012-0000-0000-000000000000', 'f1000000-0005-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0012-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);

-- ดัมเบล → น้ำหนัก
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0011-0000-0000-000000000000', 'f1000000-0007-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0011-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', FALSE, 2);

-- ยางยืด → แรงต้าน + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0013-0000-0000-000000000000', 'f1000000-0010-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0013-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', FALSE, 2);

-- ฟุตบอล → เบอร์ลูกบอล + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-0070-0000-0000-000000000000', 'f1000000-0006-0000-0000-000000000000', TRUE, 1),
  ('c2000000-0070-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', FALSE, 2);

-- อุปกรณ์เสริมวิ่ง (ถุงเท้า) → ไซส์ถุงเท้า + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c3000000-0003-0000-0000-000000000000', 'f1000000-0012-0000-0000-000000000000', FALSE, 1),
  ('c3000000-0003-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', FALSE, 2);

-- หมวก → ขนาดหมวก + สี
INSERT INTO category_attribute_groups (category_id, group_id, is_required, sort_order) VALUES
  ('c2000000-009a-0000-0000-000000000000', 'f1000000-0009-0000-0000-000000000000', TRUE, 1),
  ('c2000000-009a-0000-0000-000000000000', 'f1000000-0003-0000-0000-000000000000', TRUE, 2);
