-- Create admin user using the signup approach
DO $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = '09157109838@iroliashop.local') THEN
    -- Insert the user
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
    ) RETURNING id INTO user_uuid;

    -- Insert profile manually if the trigger didn't work
    INSERT INTO public.profiles (id, name, email, phone, role, created_at, updated_at)
    VALUES (
      user_uuid,
      'Admin User',
      '09157109838@iroliashop.local',
      '09157109838',
      'admin',
      now(),
      now()
    ) ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      updated_at = now();
  ELSE
    -- Get existing user ID and update profile to admin
    SELECT id INTO user_uuid FROM auth.users WHERE email = '09157109838@iroliashop.local';
    
    UPDATE public.profiles 
    SET role = 'admin', updated_at = now()
    WHERE id = user_uuid;
  END IF;
END $$;