
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
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
  created_at: string;
  updated_at: string;
}

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message || 'خطا در دریافت محصولات');
      toast.error('خطا در دریافت محصولات');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      toast.error('خطا در دریافت محصولات ویژه');
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    getProduct: async (id: string) => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error('خطا در دریافت محصول');
        throw error;
      }
    },
    fetchFeaturedProducts,
    createProduct: async (productData: {
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
          toast.error('حداکثر 4 محصول ویژه مجاز است');
        } else {
          toast.error('خطا در افزودن محصول');
        }
        throw error;
      }
    },
    updateProduct: async (id: string, productData: {
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
    },
    deleteProduct: async (id: string) => {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('محصول با موفقیت حذف شد');
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast.error('خطا در حذف محصول');
        throw error;
      }
    },
    bulkUpdatePrices: async (categoryId: string, increaseAmount: number) => {
      try {
        // First, get all products in the category
        const { data: products, error: fetchError } = await supabase
          .from('products')
          .select('id, price')
          .eq('category_id', categoryId);

        if (fetchError) throw fetchError;

        if (!products || products.length === 0) {
          toast.error('محصولی در این دسته‌بندی یافت نشد');
          return;
        }

        // Update each product's price
        const updatePromises = products.map(product => {
          const newPrice = (product.price || 0) + increaseAmount;
          return supabase
            .from('products')
            .update({ price: newPrice })
            .eq('id', product.id);
        });

        const results = await Promise.all(updatePromises);
        
        // Check for any errors
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          throw new Error(`خطا در به‌روزرسانی ${errors.length} محصول`);
        }

        // Refresh products list
        await fetchProducts();
        
        toast.success(`قیمت ${products.length} محصول با موفقیت به‌روزرسانی شد`);
      } catch (error: any) {
        console.error('Error bulk updating prices:', error);
        toast.error('خطا در به‌روزرسانی گروهی قیمت‌ها');
        throw error;
      }
    },
    refetch: fetchProducts,
  };
};
