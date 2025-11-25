import { useState, useEffect } from 'react';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      console.log('Categories fetched successfully:', data);
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError(error.message || 'خطا در دریافت دسته‌بندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (title: string, imageUrl?: string | null) => {
    try {
      console.log('Creating category:', { title, imageUrl });
      const { data, error } = await supabase
        .from('categories')
        .insert([{ title, image_url: imageUrl }])
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }
      
      console.log('Category created successfully:', data);
      setCategories(prev => [...prev, data].sort((a, b) => a.title.localeCompare(b.title)));
      toast.success('دسته‌بندی با موفقیت اضافه شد');
      return data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error('خطا در افزودن دسته‌بندی');
      throw error;
    }
  };

  const updateCategory = async (id: string, title: string, imageUrl?: string | null) => {
    try {
      console.log('Updating category:', { id, title, imageUrl });
      const { data, error } = await supabase
        .from('categories')
        .update({ title, image_url: imageUrl })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      
      console.log('Category updated successfully:', data);
      setCategories(prev => prev.map(c => c.id === id ? data : c).sort((a, b) => a.title.localeCompare(b.title)));
      toast.success('دسته‌بندی با موفقیت ویرایش شد');
      return data;
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error('خطا در ویرایش دسته‌بندی');
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('Starting delete process for category:', id);
      
      console.log('Checking for ALL products in category (active and inactive)...');
      const { data: products, error: checkError } = await supabase
        .from('products')
        .select('id, is_active')
        .eq('category_id', id);

      if (checkError) {
        console.error('Error checking products:', checkError);
        throw checkError;
      }

      console.log('All products found in category:', products?.length || 0, products);

      if (products && products.length > 0) {
        console.log('Category has products, cannot delete');
        const activeProducts = products.filter(p => p.is_active).length;
        const inactiveProducts = products.filter(p => !p.is_active).length;
        const totalProducts = products.length;
        
        toast.error(`این دسته‌بندی دارای ${totalProducts} محصول است. ابتدا تمام محصولات را حذف کنید`);
        return;
      }

      console.log('No products found, proceeding with delete...');
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
      
      console.log('Category deleted successfully');
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('دسته‌بندی با موفقیت حذف شد');
    } catch (error: any) {
      console.error('Error in deleteCategory function:', error);
      if (error.message) {
        console.error('Error message:', error.message);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
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
      console.error('Error updating category order:', error);
      toast.error('خطا در به‌روزرسانی ترتیب');
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    updateCategoryOrder,
    refetch: fetchCategories,
  };
};
