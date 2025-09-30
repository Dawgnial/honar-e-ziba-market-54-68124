import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Check, X, Eye, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toFarsiNumber } from "../utils/numberUtils";

interface ProductComment {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  products?: {
    title: string;
  };
}

export default function AdminComments() {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_comments')
        .select(`
          *,
          products!product_comments_product_id_fkey (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('خطا در دریافت نظرات');
    } finally {
      setLoading(false);
    }
  };

  const updateCommentStatus = async (commentId: string, isApproved: boolean) => {
    try {
      setUpdating(commentId);
      const { error } = await supabase
        .from('product_comments')
        .update({ is_approved: isApproved })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, is_approved: isApproved }
            : comment
        )
      );

      toast.success(isApproved ? 'نظر تأیید شد' : 'نظر رد شد');
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast.error('خطا در به‌روزرسانی نظر');
    } finally {
      setUpdating(null);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) return;

    try {
      setUpdating(commentId);
      const { error } = await supabase
        .from('product_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('نظر حذف شد');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error('خطا در حذف نظر');
    } finally {
      setUpdating(null);
    }
  };

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const pendingComments = comments.filter(c => !c.is_approved);
  const approvedComments = comments.filter(c => c.is_approved);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">مدیریت نظرات</h1>
          <p className="text-muted-foreground">
            مشاهده و مدیریت نظرات کاربران برای محصولات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">کل نظرات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{toFarsiNumber(comments.length)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">در انتظار تأیید</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {toFarsiNumber(pendingComments.length)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">تأیید شده</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {toFarsiNumber(approvedComments.length)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Comments */}
        {pendingComments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-500" />
              نظرات در انتظار تأیید ({toFarsiNumber(pendingComments.length)})
            </h2>
            
            {pendingComments.map((comment) => (
              <Card key={comment.id} className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-10 w-10 ml-3">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {comment.user_name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{comment.user_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              محصول: {comment.products?.title}
                            </p>
                          </div>
                          <div className="text-left">
                            <RatingStars rating={comment.rating} />
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(comment.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-foreground leading-relaxed bg-white dark:bg-gray-800 p-3 rounded-lg">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mr-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCommentStatus(comment.id, true)}
                        disabled={updating === comment.id}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 ml-1" />
                        تأیید
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteComment(comment.id)}
                        disabled={updating === comment.id}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 ml-1" />
                        رد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Approved Comments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            نظرات تأیید شده ({toFarsiNumber(approvedComments.length)})
          </h2>
          
          {approvedComments.length > 0 ? (
            approvedComments.map((comment) => (
              <Card key={comment.id} className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-10 w-10 ml-3">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {comment.user_name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              {comment.user_name}
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                تأیید شده
                              </Badge>
                            </h4>
                            
                            <p className="text-sm text-muted-foreground">
                              محصول: {comment.products?.title}
                            </p>
                          </div>
                          <div className="text-left">
                            <RatingStars rating={comment.rating} />
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(comment.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-foreground leading-relaxed bg-white dark:bg-gray-800 p-3 rounded-lg">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mr-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCommentStatus(comment.id, false)}
                        disabled={updating === comment.id}
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        <X className="h-4 w-4 ml-1" />
                        لغو تأیید
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteComment(comment.id)}
                        disabled={updating === comment.id}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 ml-1" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              هنوز هیچ نظر تأیید شده‌ای وجود ندارد.
            </p>
          )}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              هیچ نظری یافت نشد
            </h3>
            <p className="text-muted-foreground">
              هنوز هیچ نظری برای محصولات ثبت نشده است.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}