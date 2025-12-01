
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Heart, Star, StarHalf } from "lucide-react";
import { Product } from "@/types";
import { formatPriceToFarsi, toFarsiNumber } from "../utils/numberUtils";
import { useCategoryName } from "../utils/categoryUtils";
import OptimizedImage from "./OptimizedImage";

interface ModernProductCardProps {
  product: Product;
  categories: any[];
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

const ModernProductCard = ({ product, categories, onAddToCart, onToggleFavorite, isFavorite }: ModernProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Check if product is available based on manual availability status only
  const isAvailable = product.availability_status === 'available';
  
  // Calculate real discount prices
  const discountPercentage = product.discount_percentage || 0;
  const originalPrice = product.price;
  const discountedPrice = discountPercentage > 0 
    ? originalPrice * (1 - discountPercentage / 100)
    : originalPrice;
  
  const categoryName = useCategoryName(categories, product.category_id);


  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Image Container - Fixed aspect ratio to prevent layout shifts */}
      <div className="relative w-full flex-shrink-0" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          <Link to={`/product/${product.id}`}>
            <OptimizedImage
              src={product.imageUrl}
              alt={product.title}
              className="group-hover:scale-110"
              priority={false}
              aspectRatio="square"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold">
              {discountPercentage}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
              ویژه
            </Badge>
          )}
          {!isAvailable && (
            <Badge variant="destructive" className="text-xs font-bold">
              ناموجود
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-white/90 hover:bg-white shadow-lg border-0 rounded-full"
            onClick={onToggleFavorite}
            disabled={!isAvailable}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="text-xs">
            {categoryName}
          </Badge>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 hover:text-green-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          {discountPercentage > 0 && (
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-sm text-gray-500 line-through">
                {formatPriceToFarsi(originalPrice)}
              </span>
              <Badge className="bg-red-500 text-white text-xs">
                {discountPercentage}% تخفیف
              </Badge>
            </div>
          )}
          <div className="text-xl font-bold text-green-600">
            {formatPriceToFarsi(Math.round(discountedPrice))} تومان
          </div>
        </div>


        {/* Action Button - چسباندن به پایین */}
        <div className="mt-auto">
          <Button
            onClick={onAddToCart}
            disabled={!isAvailable}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 transition-all duration-300"
          >
            <ShoppingCart className="ml-2 h-4 w-4" />
            {isAvailable ? 'افزودن به سبد' : 'ناموجود'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernProductCard;
