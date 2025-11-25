
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
  parent_id: string | null;
  helpful_count: number;
  replies?: ProductComment[];
  isLikedByUser?: boolean;
}

export const useProductComments = (productId: string) => {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Fetch all comments (both parent and replies)
      const { data, error } = await supabase
        .from('product_comments')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const allComments = (data || []) as ProductComment[];
      
      // Check which comments the user has liked
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: likes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);
        
        const likedIds = new Set(likes?.map(l => l.comment_id) || []);
        allComments.forEach(comment => {
          comment.isLikedByUser = likedIds.has(comment.id);
        });
      }
      
      // Separate parent comments and replies
      const parentComments = allComments.filter(c => !c.parent_id);
      const repliesMap = new Map<string, ProductComment[]>();
      
      allComments.filter(c => c.parent_id).forEach(reply => {
        if (!repliesMap.has(reply.parent_id!)) {
          repliesMap.set(reply.parent_id!, []);
        }
        repliesMap.get(reply.parent_id!)!.push(reply);
      });
      
      // Attach replies to parent comments
      parentComments.forEach(comment => {
        comment.replies = repliesMap.get(comment.id) || [];
      });
      
      setComments(parentComments);
    } catch (error: any) {
      // Silently handle error - don't expose schema details
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData: {
    user_name: string;
    rating: number;
    comment: string;
    parent_id?: string | null;
  }) => {
    try {
      setSubmitting(true);
      
      // بررسی صحت داده‌ها قبل از ارسال
      if (!productId || !commentData.user_name || !commentData.comment || (!commentData.parent_id && !commentData.rating)) {
        throw new Error('لطفاً تمام فیلدها را پر کنید');
      }

      const { data, error } = await supabase
        .from('product_comments')
        .insert([{
          product_id: productId,
          user_name: commentData.user_name.trim(),
          rating: commentData.parent_id ? 0 : Math.max(1, Math.min(5, commentData.rating)),
          comment: commentData.comment.trim(),
          is_approved: false,
          parent_id: commentData.parent_id || null,
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success(commentData.parent_id ? 'پاسخ شما ثبت شد و پس از تأیید نمایش داده می‌شود' : 'نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد');
      // refresh comments لیست
      await fetchComments();
      return data as ProductComment;
    } catch (error: any) {
      // SECURITY: Don't log detailed errors
      
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

  const toggleLike = async (commentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('برای لایک کردن باید وارد شوید');
        return;
      }

      // Check if already liked
      const { data: existing } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Unlike
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id });
        
        if (error) throw error;
      }

      // Refresh to get updated counts
      await fetchComments();
    } catch (error: any) {
      toast.error('خطا در ثبت لایک');
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
      if (comment.rating > 0) {
        distribution[comment.rating as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const getFilteredComments = () => {
    if (filter === 'all') return comments;
    return comments.filter(c => c.rating === parseInt(filter));
  };

  useEffect(() => {
    if (productId) {
      fetchComments();
    }
  }, [productId]);

  return {
    comments: getFilteredComments(),
    allComments: comments,
    loading,
    submitting,
    filter,
    setFilter,
    addComment,
    toggleLike,
    getAverageRating,
    getRatingDistribution,
    refetch: fetchComments,
  };
};
