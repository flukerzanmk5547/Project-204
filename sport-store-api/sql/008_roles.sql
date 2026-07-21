-- 008: RBAC — เปลี่ยน role constraint เป็น customer/reseller/manager

-- แปลง role เดิม (admin, employee) เป็น manager
UPDATE profiles SET role = 'manager' WHERE role IN ('admin', 'employee');

-- Drop CHECK constraint เดิม แล้วสร้างใหม่
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'reseller', 'manager'));

-- Default ยังคงเป็น customer
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'customer';
