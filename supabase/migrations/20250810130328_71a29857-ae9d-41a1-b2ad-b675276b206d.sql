-- Update admin user password
-- First let's set a known password for admin
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = '09157109838@iroliashop.local';