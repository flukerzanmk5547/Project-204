-- 013: เพิ่ม role 'superadmin' เข้า CHECK constraint
--
-- ปัญหา: 008_roles.sql กำหนด CHECK (role IN ('customer','reseller','manager'))
--        แต่โค้ดฝั่ง backend ใช้ role 'superadmin' อยู่หลายจุด เช่น
--          - src/plugins/AuthPlugin.ts        → type Role รวม 'superadmin' (level 3)
--          - src/modules/auth/AuthSchema.ts   → z.enum([... 'superadmin'])
--          - src/modules/auth/AuthService.ts  → ตรวจสิทธิ์แต่งตั้ง superadmin
--          - src/modules/superadmin/*         → requireRole('superadmin')
--          - scripts/seed-superadmin.ts       → UPDATE profiles SET role = 'superadmin'
--        ทำให้ตั้ง superadmin ไม่ได้ (ชน constraint) และ SuperAdminRoutes ใช้งานไม่ได้เลย
--
-- แก้: เพิ่ม 'superadmin' เข้า constraint ให้ตรงกับโค้ด

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'reseller', 'manager', 'superadmin'));

-- Default ยังคงเป็น customer เหมือนเดิม
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';
