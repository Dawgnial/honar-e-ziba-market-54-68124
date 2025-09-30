-- Reset password for admin user properly
UPDATE auth.users 
SET 
  encrypted_password = '$2a$10$Q7z8C7z8C7z8C7z8C7z8CeOb1YY4Zl.lG4RgOl2d2Ng7z8C7z8C7z8',
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{password_updated}',
    'true'
  )
WHERE email = '09157109838@iroliashop.local';

-- Let's also check if user exists
SELECT id, email, encrypted_password FROM auth.users WHERE email = '09157109838@iroliashop.local';