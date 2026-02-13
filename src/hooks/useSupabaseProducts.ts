import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: loading, error: queryError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const error = queryError ? (queryError as Error).message : null;

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  };

  return {
    products,
    loading,
    error,
    getProduct: async (id: string) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
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
        
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success('محصول با موفقیت اضافه شد');
        return data;
      } catch (error: any) {
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
        
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success('محصول با موفقیت ویرایش شد');
        return data;
      } catch (error: any) {
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
        
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success('محصول با موفقیت حذف شد');
      } catch (error: any) {
        toast.error('خطا در حذف محصول');
        throw error;
      }
    },
    bulkUpdatePrices: async (categoryId: string, increaseAmount: number) => {
      try {
        const { data: prods, error: fetchError } = await supabase
          .from('products')
          .select('id, price')
          .eq('category_id', categoryId);

        if (fetchError) throw fetchError;

        if (!prods || prods.length === 0) {
          toast.error('محصولی در این دسته‌بندی یافت نشد');
          return;
        }

        const updatePromises = prods.map(product => {
          const newPrice = (product.price || 0) + increaseAmount;
          return supabase
            .from('products')
            .update({ price: newPrice })
            .eq('id', product.id);
        });

        const results = await Promise.all(updatePromises);
        const errors = results.filter(result => result.error);
        if (errors.length > 0) {
          throw new Error(`خطا در به‌روزرسانی ${errors.length} محصول`);
        }

        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success(`قیمت ${prods.length} محصول با موفقیت به‌روزرسانی شد`);
      } catch (error: any) {
        toast.error('خطا در به‌روزرسانی گروهی قیمت‌ها');
        throw error;
      }
    },
    refetch,
  };
};
