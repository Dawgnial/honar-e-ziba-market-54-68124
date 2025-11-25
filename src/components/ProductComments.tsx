
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageCircle, ThumbsUp, Reply } from "lucide-react";
import { useProductComments, ProductComment } from "../hooks/useProductComments";
import { Skeleton } from "@/components/ui/skeleton";
import { toFarsiNumber } from "../utils/numberUtils";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductCommentsProps {
  productId: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "نام باید حداقل ۲ حرف باشد.",
  }),
  rating: z.number().min(1, {
    message: "لطفاً یک امتیاز انتخاب کنید.",
  }).max(5),
  comment: z.string().min(5, {
    message: "نظر باید حداقل ۵ حرف باشد.",
  }),
});

const replySchema = z.object({
  name: z.string().min(2, {
    message: "نام باید حداقل ۲ حرف باشد.",
  }),
  comment: z.string().min(5, {
    message: "پاسخ باید حداقل ۵ حرف باشد.",
  }),
});

export function ProductComments({ productId }: ProductCommentsProps) {
  const { 
    comments, 
    allComments,
    loading, 
    submitting, 
    filter,
    setFilter,
    addComment, 
    toggleLike,
    getAverageRating, 
    getRatingDistribution 
  } = useProductComments(productId);
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rating: 0,
      comment: "",
    },
  });

  const replyForm = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      name: "",
      comment: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await addComment({
        user_name: data.name,
        rating: data.rating,
        comment: data.comment,
      });
      
      form.reset({
        name: "",
        rating: 0,
        comment: "",
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  async function onReplySubmit(data: z.infer<typeof replySchema>) {
    if (!replyingTo) return;
    
    try {
      await addComment({
        user_name: data.name,
        rating: 0,
        comment: data.comment,
        parent_id: replyingTo,
      });
      
      replyForm.reset();
      setReplyingTo(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const RatingStars = ({ rating, setRating, interactive = false }: { 
    rating: number, 
    setRating?: (r: number) => void,
    interactive?: boolean 
  }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            } ${interactive && setRating ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setRating && setRating(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "همین الان";
    if (diffInHours < 24) return `${toFarsiNumber(diffInHours)} ساعت پیش`;
    if (diffInHours < 24 * 7) return `${toFarsiNumber(Math.floor(diffInHours / 24))} روز پیش`;
    if (diffInHours < 24 * 30) return `${toFarsiNumber(Math.floor(diffInHours / (24 * 7)))} هفته پیش`;
    return `${toFarsiNumber(Math.floor(diffInHours / (24 * 30)))} ماه پیش`;
  };

  const CommentItem = ({ comment, isReply = false }: { comment: ProductComment; isReply?: boolean }) => (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow",
      isReply && "mr-12 mt-3 border-r-4 border-r-primary/30"
    )}>
      <div className="flex items-start">
        <Avatar className="h-10 w-10 ml-3">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {comment.user_name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h5 className="font-medium text-foreground">{comment.user_name}</h5>
              <div className="flex items-center mt-1">
                {comment.rating > 0 && <RatingStars rating={comment.rating} />}
                <span className={cn("text-sm text-gray-500", comment.rating > 0 && "mr-2")}>
                  {formatDate(comment.created_at)}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-foreground/80 leading-relaxed mb-3">{comment.comment}</p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={() => toggleLike(comment.id)}
            >
              <ThumbsUp className={cn(
                "h-4 w-4",
                comment.isLikedByUser && "fill-primary text-primary"
              )} />
              <span className="text-sm">
                {comment.helpful_count > 0 && toFarsiNumber(comment.helpful_count)}
                {comment.helpful_count > 0 ? " مفید" : "مفید بود؟"}
              </span>
            </Button>
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-4 w-4" />
                <span className="text-sm">پاسخ</span>
              </Button>
            )}
          </div>
          
          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 bg-muted/30 p-4 rounded-lg">
              <Form {...replyForm}>
                <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-3">
                  <FormField
                    control={replyForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="نام شما" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={replyForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="پاسخ خود را بنویسید..." 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={submitting}
                    >
                      {submitting ? "در حال ارسال..." : "ارسال پاسخ"}
                    </Button>
                    <Button 
                      type="button" 
                      size="sm"
                      variant="ghost"
                      onClick={() => setReplyingTo(null)}
                    >
                      انصراف
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary">نظرات کاربران</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-primary mb-4">نظرات کاربران</h3>
        
        {/* Rating Summary */}
        {allComments.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {toFarsiNumber(averageRating.toFixed(1))}
                </div>
                <RatingStars rating={Math.round(averageRating)} />
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  از {toFarsiNumber(allComments.length)} نظر
                </div>
              </div>
              
              <div className="flex-1 max-w-xs mr-6">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center mb-1 text-sm">
                    <span className="w-4">{toFarsiNumber(star)}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 ml-1" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 ml-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: allComments.length > 0 
                            ? `${(ratingDistribution[star as keyof typeof ratingDistribution] / allComments.length) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 mr-2">
                      {toFarsiNumber(ratingDistribution[star as keyof typeof ratingDistribution])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Comment form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
        <h4 className="text-lg font-medium mb-4">نظر خود را ثبت کنید</h4>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام شما</FormLabel>
                    <FormControl>
                      <Input placeholder="نام خود را وارد کنید" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>امتیاز شما</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RatingStars 
                        rating={field.value} 
                        setRating={(value) => field.onChange(value)} 
                        interactive={true}
                      />
                      <span className="text-sm text-gray-500 mr-2">
                        {field.value > 0 && `${toFarsiNumber(field.value)} از ۵ ستاره`}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نظر شما</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="نظر خود را در مورد این محصول بنویسید..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90" 
              disabled={submitting}
            >
              {submitting ? "در حال ثبت..." : "ثبت نظر"}
            </Button>
          </form>
        </Form>
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h4 className="text-lg font-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            نظرات ({toFarsiNumber(allComments.length)})
          </h4>
          
          {allComments.length > 0 && (
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فیلتر امتیاز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه نظرات</SelectItem>
                <SelectItem value="5">۵ ستاره</SelectItem>
                <SelectItem value="4">۴ ستاره</SelectItem>
                <SelectItem value="3">۳ ستاره</SelectItem>
                <SelectItem value="2">۲ ستاره</SelectItem>
                <SelectItem value="1">۱ ستاره</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : allComments.length > 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-foreground/60">
              هیچ نظری با این امتیاز وجود ندارد
            </p>
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              اولین نفری باشید که نظر می‌دهد
            </h3>
            <p className="text-foreground/60">
              هنوز هیچ نظری برای این محصول ثبت نشده است.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
