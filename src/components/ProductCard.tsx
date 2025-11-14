
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { Product } from "@/types";
import { formatPriceToFarsi, toFarsiNumber } from "../utils/numberUtils";
import { getCategoryName } from "../utils/categoryUtils";
import ProductQuickView from "./ProductQuickView";
import { useProductComments } from "../hooks/useProductComments";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { getAverageRating, comments } = useProductComments(product.id);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleQuickViewOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setIsQuickViewOpen(false);
  };

  const isAvailable = product.availability_status === 'available';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        
        {/* Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ProductQuickView
            product={product}
            isOpen={isQuickViewOpen}
            onClose={handleQuickViewClose}
            onAddToCart={onAddToCart}
            isFavorite={isFavorite}
            onFavoriteToggle={handleFavoriteToggle}
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
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs font-medium">
            {getCategoryName(product.category_id)}
          </Badge>
        </div>

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
      <div className="p-5 flex flex-col h-full">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-terracotta transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 whitespace-pre-wrap">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const averageRating = getAverageRating();
              const hasComments = comments.length > 0;
              return (
                <Star 
                  key={i} 
                  size={16} 
                  className={
                    hasComments && i < Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }
                />
              );
            })}
          </div>
          {comments.length > 0 ? (
            <span className="text-sm text-gray-500 mr-2">
              ({toFarsiNumber(getAverageRating().toFixed(1))})
            </span>
          ) : (
            <span className="text-sm text-gray-500 mr-2">
              (بدون امتیاز)
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            {isAvailable ? (
              <>
                {product.discount_percentage && product.discount_percentage > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-terracotta">
                        {formatPriceToFarsi(Math.round(product.price * (1 - product.discount_percentage / 100)))} تومان
                      </p>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPriceToFarsi(product.price)}
                      </span>
                    </div>
                    <Badge className="bg-red-500 text-white text-xs w-fit">
                      {toFarsiNumber(product.discount_percentage)}% تخفیف
                    </Badge>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-terracotta">
                    {formatPriceToFarsi(product.price)} تومان
                  </p>
                )}
              </>
            ) : (
              <div className="text-2xl font-bold text-red-500">
                ناموجود
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Button - استفاده از mt-auto برای چسباندن به پایین */}
        <div className="mt-auto">
          <Button
            onClick={onAddToCart}
            disabled={!isAvailable}
            className={`w-full transition-all duration-300 ${
              isAvailable
                ? 'bg-terracotta hover:bg-terracotta/90 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="ml-2" size={18} />
            {isAvailable ? 'افزودن به سبد' : 'ناموجود'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
