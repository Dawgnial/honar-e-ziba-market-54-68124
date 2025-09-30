import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ProductCustomAttribute {
  id: string;
  product_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  options?: ProductCustomAttributeOption[];
}

export interface ProductCustomAttributeOption {
  id: string;
  attribute_id: string;
  display_value: string;
  price_modifier: number;
  created_at: string;
}

export const useProductCustomAttributes = () => {
  const [attributes, setAttributes] = useState<ProductCustomAttribute[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProductCustomAttributes = async (productId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('product_custom_attributes')
        .select(`
          *,
          product_custom_attribute_options (*)
        `)
        .eq('product_id', productId)
        .order('created_at');

      if (error) throw error;
      
      const transformedData = data?.map(attr => ({
        ...attr,
        options: attr.product_custom_attribute_options || []
      })) || [];
      
      setAttributes(transformedData);
    } catch (error: any) {
      console.error('Error fetching product custom attributes:', error);
      toast.error('خطا در دریافت ویژگی‌های محصول');
    } finally {
      setLoading(false);
    }
  };

  const createProductCustomAttribute = async (productId: string, name: string) => {
    try {
      const { data, error } = await supabase
        .from('product_custom_attributes')
        .insert({
          product_id: productId,
          name: name
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('ویژگی جدید اضافه شد');
      
      // Refresh attributes
      await fetchProductCustomAttributes(productId);
      
      return data;
    } catch (error: any) {
      console.error('Error creating product custom attribute:', error);
      toast.error('خطا در ایجاد ویژگی');
      throw error;
    }
  };

  const deleteProductCustomAttribute = async (attributeId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('product_custom_attributes')
        .delete()
        .eq('id', attributeId);

      if (error) throw error;
      
      toast.success('ویژگی حذف شد');
      
      // Refresh attributes
      await fetchProductCustomAttributes(productId);
    } catch (error: any) {
      console.error('Error deleting product custom attribute:', error);
      toast.error('خطا در حذف ویژگی');
    }
  };

  const createAttributeOption = async (attributeId: string, displayValue: string, priceModifier: number, productId: string) => {
    try {
      const { error } = await supabase
        .from('product_custom_attribute_options')
        .insert({
          attribute_id: attributeId,
          display_value: displayValue,
          price_modifier: priceModifier
        });

      if (error) throw error;
      
      toast.success('آپشن جدید اضافه شد');
      
      // Refresh attributes
      await fetchProductCustomAttributes(productId);
    } catch (error: any) {
      console.error('Error creating attribute option:', error);
      toast.error('خطا در ایجاد آپشن');
    }
  };

  const deleteAttributeOption = async (optionId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('product_custom_attribute_options')
        .delete()
        .eq('id', optionId);

      if (error) throw error;
      
      toast.success('آپشن حذف شد');
      
      // Refresh attributes
      await fetchProductCustomAttributes(productId);
    } catch (error: any) {
      console.error('Error deleting attribute option:', error);
      toast.error('خطا در حذف آپشن');
    }
  };

  return {
    attributes,
    loading,
    fetchProductCustomAttributes,
    createProductCustomAttribute,
    deleteProductCustomAttribute,
    createAttributeOption,
    deleteAttributeOption
  };
};