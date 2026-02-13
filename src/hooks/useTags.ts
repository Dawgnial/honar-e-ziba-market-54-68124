import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Tag {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductTag {
  id: string;
  product_id: string;
  tag_id: string;
  tag?: Tag;
}

export const useTags = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const error = queryError ? (queryError as Error).message : null;

  const fetchTags = () => queryClient.invalidateQueries({ queryKey: ['tags'] });

  const createTag = async (name: string, displayOrder: number = 0) => {
    try {
      const { data, error: createError } = await supabase
        .from('tags')
        .insert([{ name, display_order: displayOrder, is_active: true }])
        .select()
        .single();

      if (createError) throw createError;
      
      toast({ title: 'موفق', description: 'هشتگ با موفقیت اضافه شد' });
      fetchTags();
      return data;
    } catch (err: any) {
      toast({
        title: 'خطا',
        description: err.message.includes('duplicate') ? 'این هشتگ قبلاً ثبت شده است' : 'خطا در ایجاد هشتگ',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateTag = async (id: string, updates: Partial<Tag>) => {
    try {
      const { error: updateError } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      
      toast({ title: 'موفق', description: 'هشتگ با موفقیت به‌روزرسانی شد' });
      fetchTags();
    } catch (err: any) {
      toast({ title: 'خطا', description: 'خطا در به‌روزرسانی هشتگ', variant: 'destructive' });
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      toast({ title: 'موفق', description: 'هشتگ با موفقیت حذف شد' });
      fetchTags();
    } catch (err: any) {
      toast({ title: 'خطا', description: 'خطا در حذف هشتگ', variant: 'destructive' });
      throw err;
    }
  };

  const updateDisplayOrder = async (tagId: string, newOrder: number) => {
    try {
      const { error: updateError } = await supabase
        .from('tags')
        .update({ display_order: newOrder })
        .eq('id', tagId);

      if (updateError) throw updateError;
      fetchTags();
    } catch (err: any) {
      throw err;
    }
  };

  const getProductTags = async (productId: string): Promise<Tag[]> => {
    try {
      const { data, error } = await supabase
        .from('product_tags')
        .select(`tag_id, tags:tag_id (*)`)
        .eq('product_id', productId);

      if (error) throw error;
      return data?.map((pt: any) => pt.tags).filter(Boolean) || [];
    } catch (err: any) {
      return [];
    }
  };

  const setProductTags = async (productId: string, tagIds: string[]) => {
    try {
      await supabase.from('product_tags').delete().eq('product_id', productId);

      if (tagIds.length > 0) {
        const { error: insertError } = await supabase
          .from('product_tags')
          .insert(tagIds.map(tagId => ({ product_id: productId, tag_id: tagId })));

        if (insertError) throw insertError;
      }
    } catch (err: any) {
      throw err;
    }
  };

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    updateDisplayOrder,
    getProductTags,
    setProductTags,
  };
};
