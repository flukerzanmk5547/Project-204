-- ============================================
-- SEED: Water Sports + Cycling products
-- เติมสินค้าให้หมวด water-sports และ cycling (เดิมว่างเปล่า)
-- Hero banner สไลด์ "DIVE INTO SUMMER" และ "RIDE THE WAVE" ลิงก์มาหมวดนี้
-- ============================================

-- ---- WATER SPORTS ----
-- swimming     c2000000-0030 / diving c2000000-0031
-- surfing      c2000000-0032 / kayaking c2000000-0033
INSERT INTO products (id, name, slug, price, original_price, brand, sku, category_id, images, tags, stock, is_active, is_new, discount_label, rating, review_count) VALUES
  ('a0000000-0501-0000-0000-000000000000', 'แว่นตาว่ายน้ำ ป้องกันฝ้า สำหรับผู้ใหญ่ รุ่น 500', 'swim-goggles-500', 290, 390, 'NABAIJI', 'NAB-GOG-500', 'c2000000-0030-0000-0000-000000000000', '["https://picsum.photos/id/1069/600/600"]'::JSONB, '["Sale"]'::JSONB, 300, TRUE, FALSE, 'Sale -26%', 4.6, 1820),
  ('a0000000-0502-0000-0000-000000000000', 'ชุดว่ายน้ำวันพีซ สำหรับผู้หญิง รุ่น Kamiye (สีกรม)', 'womens-onepiece-kamiye-navy', 690, NULL, 'NABAIJI', 'NAB-SWIM-KAM', 'c2000000-0030-0000-0000-000000000000', '["https://picsum.photos/id/1027/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 180, TRUE, TRUE, NULL, 4.7, 640),
  ('a0000000-0503-0000-0000-000000000000', 'หมวกว่ายน้ำซิลิโคน กระชับศีรษะ (สีฟ้า)', 'silicone-swim-cap-blue', 150, NULL, 'NABAIJI', 'NAB-CAP-SIL', 'c2000000-0030-0000-0000-000000000000', '["https://picsum.photos/id/1062/600/600"]'::JSONB, '[]'::JSONB, 500, TRUE, FALSE, NULL, 4.5, 2210),
  ('a0000000-0504-0000-0000-000000000000', 'หน้ากากดำน้ำตื้นพร้อมท่อหายใจ รุ่น SNK 520', 'snorkel-mask-set-snk520', 890, 1090, 'SUBEA', 'SUB-SNK-520', 'c2000000-0031-0000-0000-000000000000', '["https://picsum.photos/id/1040/600/600"]'::JSONB, '["Sale"]'::JSONB, 120, TRUE, FALSE, 'Sale -18%', 4.8, 970),
  ('a0000000-0505-0000-0000-000000000000', 'ตีนกบดำน้ำตื้น ปรับขนาดได้ รุ่น SNK 500', 'snorkel-fins-snk500', 590, NULL, 'SUBEA', 'SUB-FIN-500', 'c2000000-0031-0000-0000-000000000000', '["https://picsum.photos/id/1051/600/600"]'::JSONB, '[]'::JSONB, 90, TRUE, FALSE, NULL, 4.4, 415),
  ('a0000000-0506-0000-0000-000000000000', 'เซิร์ฟบอร์ดโฟม ขนาด 7 ฟุต สำหรับผู้เริ่มต้น', 'foam-surfboard-7ft', 4900, 5900, 'OLAIAN', 'OLA-SURF-7FT', 'c2000000-0032-0000-0000-000000000000', '["https://picsum.photos/id/1000/600/600"]'::JSONB, '["Sale"]'::JSONB, 30, TRUE, FALSE, 'Sale -17%', 4.9, 128),
  ('a0000000-0507-0000-0000-000000000000', 'ชุดเว็ทสูท 2 มม. สำหรับเล่นเซิร์ฟ (ผู้ชาย)', 'mens-wetsuit-2mm', 2500, NULL, 'OLAIAN', 'OLA-WET-2MM', 'c2000000-0032-0000-0000-000000000000', '["https://picsum.photos/id/1011/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 60, TRUE, TRUE, NULL, 4.6, 88),
  ('a0000000-0508-0000-0000-000000000000', 'เรือคายัคเป่าลม 2 ที่นั่ง รุ่น X100', 'inflatable-kayak-x100-2p', 8900, 10900, 'ITIWIT', 'ITI-KAYAK-X100', 'c2000000-0033-0000-0000-000000000000', '["https://picsum.photos/id/1015/600/600"]'::JSONB, '["Sale"]'::JSONB, 25, TRUE, FALSE, 'Sale -18%', 4.8, 342),
  ('a0000000-0509-0000-0000-000000000000', 'ไม้พายอะลูมิเนียมแยกส่วน ปรับความยาวได้', 'aluminum-kayak-paddle', 950, NULL, 'ITIWIT', 'ITI-PADDLE-AL', 'c2000000-0033-0000-0000-000000000000', '["https://picsum.photos/id/1016/600/600"]'::JSONB, '[]'::JSONB, 140, TRUE, FALSE, NULL, 4.5, 205),
  ('a0000000-0510-0000-0000-000000000000', 'เสื้อชูชีพลอยตัว 50N สำหรับผู้ใหญ่ (สีส้ม)', 'life-vest-50n-orange', 1200, NULL, 'ITIWIT', 'ITI-VEST-50N', 'c2000000-0033-0000-0000-000000000000', '["https://picsum.photos/id/1024/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 100, TRUE, TRUE, NULL, 4.7, 156);

-- ---- CYCLING ----
-- mountain-bike c2000000-0050 / road-bike c2000000-0051
-- folding-bike  c2000000-0052 / cycling-accessories c2000000-0053
INSERT INTO products (id, name, slug, price, original_price, brand, sku, category_id, images, tags, stock, is_active, is_new, discount_label, rating, review_count) VALUES
  ('a0000000-0601-0000-0000-000000000000', 'จักรยานเสือภูเขา 27.5 นิ้ว 21 สปีด รุ่น ST 100', 'mtb-st100-275', 8500, 9900, 'ROCKRIDER', 'ROC-MTB-ST100', 'c2000000-0050-0000-0000-000000000000', '["https://picsum.photos/id/146/600/600"]'::JSONB, '["Sale"]'::JSONB, 40, TRUE, FALSE, 'Sale -14%', 4.7, 512),
  ('a0000000-0602-0000-0000-000000000000', 'จักรยานเสือภูเขา 29 นิ้ว ดิสก์เบรกไฮดรอลิก รุ่น ST 540', 'mtb-st540-29', 15900, NULL, 'ROCKRIDER', 'ROC-MTB-ST540', 'c2000000-0050-0000-0000-000000000000', '["https://picsum.photos/id/167/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 20, TRUE, TRUE, NULL, 4.8, 231),
  ('a0000000-0603-0000-0000-000000000000', 'จักรยานเสือหมอบเฟรมอะลูมิเนียม รุ่น RC 100', 'road-bike-rc100', 13900, 15900, 'TRIBAN', 'TRI-ROAD-RC100', 'c2000000-0051-0000-0000-000000000000', '["https://picsum.photos/id/133/600/600"]'::JSONB, '["Sale"]'::JSONB, 18, TRUE, FALSE, 'Sale -13%', 4.9, 174),
  ('a0000000-0604-0000-0000-000000000000', 'จักรยานเสือหมอบเอนดูรานซ์ 105 รุ่น RC 520', 'road-bike-rc520-105', 32900, NULL, 'TRIBAN', 'TRI-ROAD-RC520', 'c2000000-0051-0000-0000-000000000000', '["https://picsum.photos/id/183/600/600"]'::JSONB, '[]'::JSONB, 10, TRUE, FALSE, NULL, 4.9, 96),
  ('a0000000-0605-0000-0000-000000000000', 'จักรยานพับได้ 20 นิ้ว 6 สปีด รุ่น TILT 120', 'folding-bike-tilt120', 7900, 8900, 'BTWIN', 'BTW-FOLD-T120', 'c2000000-0052-0000-0000-000000000000', '["https://picsum.photos/id/136/600/600"]'::JSONB, '["Sale"]'::JSONB, 35, TRUE, FALSE, 'Sale -11%', 4.6, 388),
  ('a0000000-0606-0000-0000-000000000000', 'จักรยานพับได้น้ำหนักเบา 20 นิ้ว รุ่น TILT 500', 'folding-bike-tilt500', 11900, NULL, 'BTWIN', 'BTW-FOLD-T500', 'c2000000-0052-0000-0000-000000000000', '["https://picsum.photos/id/145/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 22, TRUE, TRUE, NULL, 4.7, 142),
  ('a0000000-0607-0000-0000-000000000000', 'หมวกจักรยานปรับกระชับได้ รุ่น ST 500 (สีดำ)', 'cycling-helmet-st500-black', 990, 1290, 'ROCKRIDER', 'ROC-HELM-ST500', 'c2000000-0053-0000-0000-000000000000', '["https://picsum.photos/id/157/600/600"]'::JSONB, '["Sale"]'::JSONB, 150, TRUE, FALSE, 'Sale -23%', 4.7, 1204),
  ('a0000000-0608-0000-0000-000000000000', 'ชุดไฟจักรยานหน้า-หลัง USB ชาร์จได้ รุ่น CL 500', 'bike-light-set-cl500', 590, NULL, 'BTWIN', 'BTW-LIGHT-CL500', 'c2000000-0053-0000-0000-000000000000', '["https://picsum.photos/id/162/600/600"]'::JSONB, '["สินค้าใหม่"]'::JSONB, 260, TRUE, TRUE, NULL, 4.5, 876),
  ('a0000000-0609-0000-0000-000000000000', 'ที่สูบลมจักรยานแบบตั้งพื้น พร้อมเกจวัดแรงดัน', 'floor-bike-pump-gauge', 690, 890, 'BTWIN', 'BTW-PUMP-FLOOR', 'c2000000-0053-0000-0000-000000000000', '["https://picsum.photos/id/169/600/600"]'::JSONB, '["Sale"]'::JSONB, 200, TRUE, FALSE, 'Sale -22%', 4.6, 933);
