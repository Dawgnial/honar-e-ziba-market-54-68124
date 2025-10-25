import React, { memo, useState, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { formatPriceToFarsi, toFarsiNumber } from "../utils/numberUtils";
import { useCategoryName } from "../utils/categoryUtils";
import LazyImage from "./LazyImage";
import { Product } from "@/types";

// Lazy load the heavy components
const ProductQuickView = lazy(() => import("./ProductQuickView"));

interface OptimizedProductCardProps {
  product: Product;
  categories: any[];
  onAddToCart: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  showRating?: boolean;
}

const OptimizedProductCard = memo(({ 
  product,
  categories,
  onAddToCart, 
  onFavoriteToggle,
  isFavorite = false,
  showRating = false
}: OptimizedProductCardProps) => {
  const categoryName = useCategoryName(categories, product.category_id);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleFavoriteToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.();
  }, [onFavoriteToggle]);

  const handleQuickViewOpen = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  }, []);

  const handleQuickViewClose = useCallback(() => {
    setIsQuickViewOpen(false);
  }, []);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
  }, [onAddToCart]);

  const isAvailable = product.availability_status === 'available';
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - product.discount_percentage / 100))
    : product.price;

  return (
    <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-border group h-full flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <LazyImage
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </Link>
        
        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Suspense fallback={<div className="h-9 w-9" />}>
            <ProductQuickView
              product={product}
              isOpen={isQuickViewOpen}
              onClose={handleQuickViewClose}
              onAddToCart={onAddToCart}
              isFavorite={isFavorite}
              onFavoriteToggle={onFavoriteToggle}
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 bg-white/90 hover:bg-white shadow-md border-0"
                  onClick={handleQuickViewOpen}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              }
            />
          </Suspense>
          
          {onFavoriteToggle && (
            <Button
              variant="outline"
              size="icon"
              className={`h-9 w-9 shadow-md border-0 transition-colors ${
                isFavorite 
                  ? 'bg-red-50 hover:bg-red-100 text-red-500' 
                  : 'bg-white/90 hover:bg-white text-gray-600'
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs font-medium">
            {categoryName}
          </Badge>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-red-500 text-white text-xs">
              {toFarsiNumber(product.discount_percentage)}% تخفیف
            </Badge>
          </div>
        )}

        {/* Stock Status */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white bg-red-600">
              ناموجود
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Rating - Only show if requested to avoid unnecessary API calls */}
        {showRating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className="text-gray-300"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground mr-2">
              (بدون امتیاز)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          {isAvailable ? (
            <>
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-red-600">
                      {formatPriceToFarsi(discountedPrice)} تومان
                    </p>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPriceToFarsi(product.price)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-bold text-foreground">
                  {formatPriceToFarsi(product.price)} تومان
                </p>
              )}
            </>
          ) : (
            <div className="text-lg font-bold text-red-500">
              ناموجود
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <Button
            onClick={handleAddToCart}
            disabled={!isAvailable}
            size="sm"
            className={`w-full transition-all duration-300 ${
              isAvailable
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="ml-2" size={16} />
            {isAvailable ? 'افزودن به سبد' : 'ناموجود'}
          </Button>
        </div>
      </div>
    </div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;