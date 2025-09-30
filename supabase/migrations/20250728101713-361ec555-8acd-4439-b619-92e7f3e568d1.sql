-- بررسی و اصلاح search_path برای تمام functions موجود برای افزایش امنیت

-- اصلاح function check_featured_products_limit
CREATE OR REPLACE FUNCTION public.check_featured_products_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NEW.is_featured = true THEN
    IF (SELECT COUNT(*) FROM products WHERE is_featured = true AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) >= 4 THEN
      RAISE EXCEPTION 'حداکثر 4 محصول ویژه مجاز است';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- اصلاح function update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- اصلاح function update_last_login
CREATE OR REPLACE FUNCTION public.update_last_login()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE public.profiles 
  SET last_login = now() 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

-- اصلاح function update_product_stock
CREATE OR REPLACE FUNCTION public.update_product_stock()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- کاهش موجودی محصول
  UPDATE products 
  SET stock = stock - NEW.quantity 
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$function$;

-- اصلاح function get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

-- اصلاح function handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- اصلاح function handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'کاربر جدید'),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@iroliashop.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$function$;