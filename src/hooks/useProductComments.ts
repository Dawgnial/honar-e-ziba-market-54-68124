
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProductComment {
  id: string;
  product_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export const useProductComments = (productId: string) => {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments((data || []) as ProductComment[]);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('خطا در دریافت نظرات');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData: {
    user_name: string;
    rating: number;
    comment: string;
  }) => {
    try {
      setSubmitting(true);
      
      // بررسی صحت داده‌ها قبل از ارسال
      if (!productId || !commentData.user_name || !commentData.comment || !commentData.rating) {
        throw new Error('لطفاً تمام فیلدها را پر کنید');
      }

      const { data, error } = await supabase
        .from('product_comments')
        .insert([{
          product_id: productId,
          user_name: commentData.user_name.trim(),
          rating: Math.max(1, Math.min(5, commentData.rating)),
          comment: commentData.comment.trim(),
          is_approved: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      toast.success('نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد');
      // refresh comments لیست
      await fetchComments();
      return data as ProductComment;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      
      // نمایش پیام خطای مناسب‌تر
      if (error.message?.includes('violates row-level security')) {
        toast.error('مشکل در احراز هویت. لطفاً دوباره تلاش کنید.');
      } else if (error.message?.includes('invalid input')) {
        toast.error('لطفاً اطلاعات معتبر وارد کنید.');
      } else {
        toast.error(error.message || 'خطا در ثبت نظر');
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = () => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return sum / comments.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    comments.forEach(comment => {
      distribution[comment.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  return {
    comments,
    loading,
    submitting,
    addComment,
    getAverageRating,
    getRatingDistribution,
    refetch: fetchComments,
  };
};
