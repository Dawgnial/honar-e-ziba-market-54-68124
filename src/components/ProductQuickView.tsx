
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Heart, ShoppingCart, X, Eye } from "lucide-react";
import { Product } from "@/types";
import { ProductComments } from "./ProductComments";
import { useCategories } from "../hooks/useCategories";
import { toFarsiNumber, formatPriceToFarsi } from "../utils/numberUtils";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  trigger?: React.ReactNode;
}

const ProductQuickView = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  isFavorite, 
  onFavoriteToggle,
  trigger
}: ProductQuickViewProps) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [activeTab, setActiveTab] = useState("details");
  
  if (!product) return null;

  const isAvailable = product.price > 0;

  const getCategoryName = (category_id: string): string => {
    if (categoriesLoading) return 'در حال بارگذاری...';
    
    const category = categories.find(c => c.id === category_id);
    return category?.title || 'دسته‌بندی نامشخص';
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors">
      <Eye size={16} className="ml-1" />
      مشاهده سریع
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[95vw] max-w-4xl h-[85vh] p-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden"
        side="top"
        align="center"
        sideOffset={10}
        avoidCollisions={true}
        sticky="always"
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-md rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Product Image */}
        <div className="relative h-48 lg:h-64 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-terracotta hover:bg-terracotta text-white text-sm shadow-lg">
              {getCategoryName(product.category_id)}
            </Badge>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 lg:p-6 max-h-[calc(85vh-12rem)] overflow-y-auto">
          <div className="text-right mb-4">
            <h2 className="text-xl lg:text-2xl font-bold text-terracotta mb-2 leading-tight">
              {product.title}
            </h2>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-stone mr-2">(۴.۲)</span>
              </div>
              <div className={`text-xl font-bold ${isAvailable ? 'text-terracotta' : 'text-red-600'}`}>
                {isAvailable ? `${formatPriceToFarsi(product.price)} تومان` : 'ناموجود'}
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-10">
              <TabsTrigger value="details" className="text-sm font-medium">جزئیات</TabsTrigger>
              <TabsTrigger value="comments" className="text-sm font-medium">نظرات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2 text-base">توضیحات محصول</h3>
                <p className="text-stone text-sm leading-relaxed text-justify line-clamp-3 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Quick Specifications */}
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm flex justify-between items-center">
                   <span className="text-stone font-medium text-sm">ارسال:</span>
                  <span className="font-bold text-blue-600 text-sm">سریع</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <Button 
                  onClick={onAddToCart}
                  disabled={!isAvailable}
                  size="sm"
                  className={`flex-1 text-sm font-medium h-10 ${isAvailable 
                    ? 'bg-terracotta hover:bg-terracotta/90 text-white shadow-lg hover:shadow-xl transition-all' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="ml-2" size={16} />
                  {isAvailable ? 'افزودن به سبد' : 'ناموجود'}
                </Button>
                <Button 
                  onClick={onFavoriteToggle}
                  variant="outline"
                  size="sm"
                  className={`px-4 h-10 transition-all ${isFavorite ? 'text-red-500 border-red-500 bg-red-50 hover:bg-red-100' : 'text-stone border-stone hover:bg-gray-50'}`}
                >
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                </Button>
              </div>

              {/* Trust badges */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                    <span className="font-medium text-green-700 dark:text-green-300">گارانتی اصل</span>
                  </div>
                  <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>
                    <span className="font-medium text-blue-700 dark:text-blue-300">ارسال سریع</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="max-h-64 overflow-y-auto">
              <ProductComments productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductQuickView;
