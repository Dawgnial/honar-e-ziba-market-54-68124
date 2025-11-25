import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminProduct {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  stock: number | null;
  discount_percentage: number | null;
  availability_status: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useSupabaseAdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching ALL products for admin...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Admin products fetched successfully:', data?.length || 0, 'products');
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching admin products:', error);
      setError(error.message || 'خطا در دریافت محصولات');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      console.log('Deleting product:', id);
      
      // Check for any constraints
      const { data: orderItems, error: checkError } = await supabase
        .from('order_items')
        .select('id')
        .eq('product_id', id)
        .limit(1);

      if (checkError) {
        console.error('Error checking order items:', checkError);
        throw checkError;
      }

      if (orderItems && orderItems.length > 0) {
        toast.error('این محصول در سفارشات استفاده شده و قابل حذف نیست');
        return;
      }

      // Check for comments
      const { data: comments, error: commentsError } = await supabase
        .from('product_comments')
        .select('id')
        .eq('product_id', id)
        .limit(1);

      if (commentsError) {
        console.error('Error checking comments:', commentsError);
      }

      // Delete comments first if they exist
      if (comments && comments.length > 0) {
        console.log('Deleting product comments first...');
        const { error: deleteCommentsError } = await supabase
          .from('product_comments')
          .delete()
          .eq('product_id', id);

        if (deleteCommentsError) {
          console.error('Error deleting comments:', deleteCommentsError);
          throw deleteCommentsError;
        }
      }

      // Now delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      console.log('Product deleted successfully');
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('محصول با موفقیت حذف شد');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(`خطا در حذف محصول: ${error.message || 'خطای نامشخص'}`);
      throw error;
    }
  };

  const createProduct = async (productData: {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    imageUrls?: string;
    categoryId: string;
    isFeatured?: boolean;
    stock?: number;
    discountPercentage?: number;
    availabilityStatus?: string;
  }) => {
    try {
      // Store imageUrls JSON if available, otherwise use imageUrl
      const imageUrlToStore = productData.imageUrls || JSON.stringify([productData.imageUrl]);
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: productData.title,
          description: productData.description,
          price: productData.price,
          image_url: imageUrlToStore,
          category_id: productData.categoryId,
          is_featured: productData.isFeatured || false,
          stock: productData.stock || 0,
          discount_percentage: productData.discountPercentage || 0,
          availability_status: productData.availabilityStatus || 'available',
        }])
        .select('*')
        .single();

      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      toast.success('محصول با موفقیت اضافه شد');
      return data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      if (error.message.includes('حداکثر 8 محصول ویژه')) {
        toast.error('حداکثر 8 محصول ویژه مجاز است');
      } else {
        toast.error('خطا در افزودن محصول');
      }
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    imageUrls?: string;
    categoryId: string;
    isFeatured?: boolean;
    stock?: number;
    discountPercentage?: number;
    availabilityStatus?: string;
  }) => {
    try {
      // Get current product data first to preserve existing values
      const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching current product:', fetchError);
        throw fetchError;
      }

      // Only update image_url if new images are provided
      let imageUrlToStore = currentProduct.image_url; // Keep existing images by default
      
      if (productData.imageUrls && productData.imageUrls !== '[]' && productData.imageUrls !== '[""]') {
        // New images provided, use them
        imageUrlToStore = productData.imageUrls;
      } else if (productData.imageUrl && productData.imageUrl !== '') {
        // Single image provided, use it
        imageUrlToStore = JSON.stringify([productData.imageUrl]);
      }
      
      const { data, error } = await supabase
        .from('products')
        .update({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          image_url: imageUrlToStore,
          category_id: productData.categoryId,
          is_featured: productData.isFeatured || false,
          stock: productData.stock || 0,
          discount_percentage: productData.discountPercentage || 0,
          availability_status: productData.availabilityStatus || 'available',
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      
      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast.success('محصول با موفقیت ویرایش شد');
      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (error.message.includes('حداکثر 8 محصول ویژه')) {
        toast.error('حداکثر 4 محصول ویژه مجاز است');
      } else {
        toast.error('خطا در ویرایش محصول');
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    deleteProduct,
    createProduct,
    updateProduct,
    refetch: fetchProducts,
  };
};