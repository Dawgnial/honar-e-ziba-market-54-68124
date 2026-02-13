import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  title: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const error = queryError ? (queryError as Error).message : null;

  const createCategory = async (title: string, imageUrl?: string | null) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ title, image_url: imageUrl }])
        .select()
        .single();

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('دسته‌بندی با موفقیت اضافه شد');
      return data;
    } catch (error: any) {
      toast.error('خطا در افزودن دسته‌بندی');
      throw error;
    }
  };

  const updateCategory = async (id: string, title: string, imageUrl?: string | null) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({ title, image_url: imageUrl })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('دسته‌بندی با موفقیت ویرایش شد');
      return data;
    } catch (error: any) {
      toast.error('خطا در ویرایش دسته‌بندی');
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('id, is_active')
        .eq('category_id', id);

      if (checkError) throw checkError;

      if (products && products.length > 0) {
        toast.error(`این دسته‌بندی دارای ${products.length} محصول است. ابتدا تمام محصولات را حذف کنید`);
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('دسته‌بندی با موفقیت حذف شد');
    } catch (error: any) {
      toast.error(`خطا در حذف دسته‌بندی: ${error.message || 'خطای نامشخص'}`);
      throw error;
    }
  };

  const updateCategoryOrder = async (categoryId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ display_order: newOrder })
        .eq('id', categoryId);

      if (error) throw error;
    } catch (error: any) {
      toast.error('خطا در به‌روزرسانی ترتیب');
      throw error;
    }
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryOrder,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  };
};
