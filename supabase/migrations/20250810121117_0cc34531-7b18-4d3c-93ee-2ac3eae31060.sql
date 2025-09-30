-- Create admin user with phone authentication - corrected version
-- First, insert the user using Supabase auth
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  phone_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  '09157109838@iroliashop.local',
  crypt('iroliashop@admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"name": "Admin User", "phone": "09157109838"}',
  '{}',
  false
);

-- Insert profile for the admin user with email field
INSERT INTO public.profiles (id, name, email, phone, role, created_at, updated_at)
SELECT 
  u.id,
  'Admin User',
  '09157109838@iroliashop.local',
  '09157109838',
  'admin',
  now(),
  now()
FROM auth.users u 
WHERE u.email = '09157109838@iroliashop.local';