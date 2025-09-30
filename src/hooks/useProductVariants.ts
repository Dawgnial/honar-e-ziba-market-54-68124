
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ProductAttribute {
  id: string;
  name: string;
  display_name: string;
  type: string;
  is_required: boolean;
}

export interface ProductAttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  display_value: string;
  price_modifier: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  attributes?: Array<{
    attribute_id: string;
    attribute_value_id: string;
    attribute_name: string;
    attribute_display_name: string;
    value: string;
    display_value: string;
  }>;
}

export const useProductVariants = () => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<ProductAttributeValue[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttributes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_attributes')
        .select('*')
        .order('display_name');
      
      if (error) throw error;
      setAttributes(data || []);
    } catch (error: any) {
      console.error('Error fetching attributes:', error);
    }
  };

  const fetchAttributeValues = async () => {
    try {
      const { data, error } = await supabase
        .from('product_attribute_values')
        .select('*')
        .order('display_value');
      
      if (error) throw error;
      setAttributeValues(data || []);
    } catch (error: any) {
      console.error('Error fetching attribute values:', error);
    }
  };

  const fetchProductVariants = async (productId: string) => {
    try {
      setLoading(true);
      
      // Fetch variants with their attributes
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select(`
          *,
          product_variant_attributes (
            attribute_id,
            attribute_value_id,
            product_attributes (
              name,
              display_name
            ),
            product_attribute_values (
              value,
              display_value
            )
          )
        `)
        .eq('product_id', productId)
        .eq('is_active', true);

      if (variantsError) throw variantsError;

      // Transform the data to match our interface
      const transformedVariants = variantsData?.map(variant => ({
        ...variant,
        attributes: variant.product_variant_attributes?.map((attr: any) => ({
          attribute_id: attr.attribute_id,
          attribute_value_id: attr.attribute_value_id,
          attribute_name: attr.product_attributes?.name || '',
          attribute_display_name: attr.product_attributes?.display_name || '',
          value: attr.product_attribute_values?.value || '',
          display_value: attr.product_attribute_values?.display_value || ''
        }))
      })) || [];

      setVariants(transformedVariants);
    } catch (error: any) {
      console.error('Error fetching product variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProductVariant = async (variantData: {
    product_id: string;
    price: number;
    stock_quantity: number;
    sku?: string;
    attributes: Array<{ attribute_id: string; attribute_value_id: string }>;
  }) => {
    try {
      setLoading(true);
      
      // Create the variant
      const { data: variant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: variantData.product_id,
          sku: variantData.sku,
          price: variantData.price,
          stock_quantity: variantData.stock_quantity,
          is_active: true
        })
        .select()
        .single();

      if (variantError) throw variantError;

      // Create variant attributes
      if (variantData.attributes.length > 0) {
        const { error: attributesError } = await supabase
          .from('product_variant_attributes')
          .insert(
            variantData.attributes.map(attr => ({
              variant_id: variant.id,
              attribute_id: attr.attribute_id,
              attribute_value_id: attr.attribute_value_id
            }))
          );

        if (attributesError) throw attributesError;
      }

      toast.success('ویژگی محصول با موفقیت اضافه شد');
      
      // Refresh variants
      await fetchProductVariants(variantData.product_id);
    } catch (error: any) {
      console.error('Error creating product variant:', error);
      toast.error('خطا در ایجاد ویژگی محصول');
    } finally {
      setLoading(false);
    }
  };

  const deleteProductVariant = async (variantId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;
      
      toast.success('ویژگی محصول حذف شد');
      
      // Refresh variants
      await fetchProductVariants(productId);
    } catch (error: any) {
      console.error('Error deleting product variant:', error);
      toast.error('خطا در حذف ویژگی محصول');
    }
  };

  const getAttributeValuesByAttributeId = (attributeId: string) => {
    return attributeValues.filter(value => value.attribute_id === attributeId);
  };

  return {
    attributes,
    attributeValues,
    variants,
    loading,
    fetchProductVariants,
    createProductVariant,
    deleteProductVariant,
    getAttributeValuesByAttributeId,
    refetchAttributes: fetchAttributes,
    refetchAttributeValues: fetchAttributeValues
  };
};
