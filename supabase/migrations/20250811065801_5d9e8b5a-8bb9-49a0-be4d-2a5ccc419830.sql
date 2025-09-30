-- Create order_history table for tracking completed orders
CREATE TABLE public.order_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  order_data JSONB NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  invoice_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  original_order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_history ENABLE ROW LEVEL SECURITY;

-- Create policies for order_history
CREATE POLICY "Admins can view all order history" 
ON public.order_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Users can view their own order history" 
ON public.order_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create order history" 
ON public.order_history 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_order_history_user_id ON public.order_history(user_id);
CREATE INDEX idx_order_history_created_at ON public.order_history(created_at DESC);