-- Create product attributes table
CREATE TABLE public.product_attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'select',
  is_required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product attribute values table
CREATE TABLE public.product_attribute_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attribute_id UUID NOT NULL REFERENCES public.product_attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  display_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product variants table
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, sku) DEFERRABLE INITIALLY DEFERRED
);

-- Create product variant attributes junction table
CREATE TABLE public.product_variant_attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.product_attributes(id) ON DELETE CASCADE,
  attribute_value_id UUID NOT NULL REFERENCES public.product_attribute_values(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(variant_id, attribute_id)
);

-- Enable RLS on all tables
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variant_attributes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_attributes
CREATE POLICY "Anyone can view product attributes" 
ON public.product_attributes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product attributes" 
ON public.product_attributes 
FOR ALL 
USING (get_user_role() = 'admin');

-- Create RLS policies for product_attribute_values
CREATE POLICY "Anyone can view product attribute values" 
ON public.product_attribute_values 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product attribute values" 
ON public.product_attribute_values 
FOR ALL 
USING (get_user_role() = 'admin');

-- Create RLS policies for product_variants
CREATE POLICY "Anyone can view active product variants" 
ON public.product_variants 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all product variants" 
ON public.product_variants 
FOR ALL 
USING (get_user_role() = 'admin');

-- Create RLS policies for product_variant_attributes
CREATE POLICY "Anyone can view product variant attributes" 
ON public.product_variant_attributes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage product variant attributes" 
ON public.product_variant_attributes 
FOR ALL 
USING (get_user_role() = 'admin');

-- Create triggers for updated_at
CREATE TRIGGER update_product_attributes_updated_at
  BEFORE UPDATE ON public.product_attributes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default attributes
INSERT INTO public.product_attributes (name, display_name, type, is_required) VALUES
  ('size', 'سایز', 'select', true),
  ('color', 'رنگ', 'color', false),
  ('material', 'جنس', 'select', false),
  ('weight', 'وزن', 'select', false);

-- Insert attribute values for size
INSERT INTO public.product_attribute_values (attribute_id, value, display_value) 
SELECT id, 'small', 'کوچک' FROM public.product_attributes WHERE name = 'size'
UNION ALL
SELECT id, 'medium', 'متوسط' FROM public.product_attributes WHERE name = 'size'
UNION ALL
SELECT id, 'large', 'بزرگ' FROM public.product_attributes WHERE name = 'size'
UNION ALL
SELECT id, 'extra_large', 'خیلی بزرگ' FROM public.product_attributes WHERE name = 'size';

-- Insert attribute values for color
INSERT INTO public.product_attribute_values (attribute_id, value, display_value) 
SELECT id, 'red', 'قرمز' FROM public.product_attributes WHERE name = 'color'
UNION ALL
SELECT id, 'blue', 'آبی' FROM public.product_attributes WHERE name = 'color'
UNION ALL
SELECT id, 'green', 'سبز' FROM public.product_attributes WHERE name = 'color'
UNION ALL
SELECT id, 'yellow', 'زرد' FROM public.product_attributes WHERE name = 'color'
UNION ALL
SELECT id, 'purple', 'بنفش' FROM public.product_attributes WHERE name = 'color'
UNION ALL
SELECT id, 'white', 'سفید' FROM public.product_attributes WHERE name = 'color'
UNION ALL
SELECT id, 'black', 'مشکی' FROM public.product_attributes WHERE name = 'color';

-- Insert attribute values for material
INSERT INTO public.product_attribute_values (attribute_id, value, display_value) 
SELECT id, 'ceramic', 'سرامیک' FROM public.product_attributes WHERE name = 'material'
UNION ALL
SELECT id, 'porcelain', 'چینی' FROM public.product_attributes WHERE name = 'material'
UNION ALL
SELECT id, 'earthenware', 'سفال' FROM public.product_attributes WHERE name = 'material'
UNION ALL
SELECT id, 'stoneware', 'سنگی' FROM public.product_attributes WHERE name = 'material';

-- Insert attribute values for weight
INSERT INTO public.product_attribute_values (attribute_id, value, display_value) 
SELECT id, 'light', 'سبک' FROM public.product_attributes WHERE name = 'weight'
UNION ALL
SELECT id, 'medium', 'متوسط' FROM public.product_attributes WHERE name = 'weight'
UNION ALL
SELECT id, 'heavy', 'سنگین' FROM public.product_attributes WHERE name = 'weight';