
import React, { useState, useEffect, memo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toFarsiNumber, formatPriceToFarsi } from "../utils/numberUtils";
import { getCategoryName } from "../utils/categoryUtils";
import { useFavorites } from "../context/FavoritesContext";
import { toast } from "sonner";
import LazyImage from "./LazyImage";
import { useProductComments } from "../hooks/useProductComments";

const FeaturedProducts = memo(() => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const featured = products.filter(product => product.is_featured === true);
    setFeaturedProducts(featured);
  }, [products]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addToCart(product, 1);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error) {
      toast.error('خطا در افزودن به سبد خرید');
    }
  };

  const handleFavoriteToggle = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorite = favorites.some(fav => fav.id === product.id);
    
    try {
      if (isFavorite) {
        removeFromFavorites(product.id);
        toast.success('محصول از علاقه‌مندی‌ها حذف شد');
      } else {
        addToFavorites(product);
        toast.success('محصول به علاقه‌مندی‌ها اضافه شد');
      }
    } catch (error) {
      toast.error('خطا در تغییر علاقه‌مندی');
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-persian-blue dark:text-white mb-4 transition-colors duration-300">
              محصولات ویژه
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              در حال حاضر محصول ویژه‌ای موجود نیست
            </p>
          </div>
          <div className="text-center">
            <Button 
              className="bg-persian-blue hover:bg-persian-blue/90 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 px-8 py-3 transition-colors duration-300"
              onClick={() => navigate('/products')}
            >
              <ShoppingCart className="ml-2" size={20} />
              مشاهده تمام محصولات
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            محصولات ویژه
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const isAvailable = product.availability_status === 'available';
            const isFavorite = favorites.some(fav => fav.id === product.id);
            
            return (
              <div key={product.id} className="group h-full">
                <div className="bg-card rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-border h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Link to={`/product/${product.id}`}>
                      <LazyImage
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-8 w-8 shadow-md border-0 transition-colors ${
                          isFavorite 
                            ? 'bg-red-50 hover:bg-red-100 text-red-500' 
                            : 'bg-white/90 hover:bg-white text-gray-600'
                        }`}
                        onClick={(e) => handleFavoriteToggle(product, e)}
                      >
                        <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                      </Button>
                    </div>

                    {/* Stock Status */}
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-white bg-red-600">
                          ناموجود
                        </Badge>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product.discount_percentage > 0 && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 text-white">
                          {toFarsiNumber(product.discount_percentage)}% تخفیف
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

                    {/* Rating */}
                    <ProductRating productId={product.id} />

                    {/* Price */}
                    <div className="mb-4">
                      {product.discount_percentage > 0 ? (
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-red-600">
                            {formatPriceToFarsi(product.price * (1 - product.discount_percentage / 100))} تومان
                          </p>
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPriceToFarsi(product.price)} تومان
                          </p>
                        </div>
                      ) : (
                         <p className={`text-lg font-bold ${isAvailable ? 'text-foreground' : 'text-muted-foreground'}`}>
                           {formatPriceToFarsi(product.price)} تومان
                         </p>
                       )}
                     </div>

                     {/* Add to Cart Button - استفاده از mt-auto برای چسباندن به پایین */}
                    <div className="mt-auto">
                      <Button
                        onClick={(e) => handleAddToCart(product, e)}
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
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-persian-blue hover:bg-persian-blue/90 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 px-8 py-3 transition-colors duration-300"
            onClick={() => navigate('/products')}
          >
            <ShoppingCart className="ml-2" size={20} />
            مشاهده تمام محصولات
          </Button>
        </div>
      </div>
    </section>
  );
});

// Component to display product rating
const ProductRating = ({ productId }: { productId: string }) => {
  const { getAverageRating, comments } = useProductComments(productId);
  const averageRating = getAverageRating();
  const hasComments = comments.length > 0;

  return (
    <div className="flex items-center mb-3">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={
              hasComments && i < Math.round(averageRating) 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }
          />
        ))}
      </div>
      {hasComments ? (
        <span className="text-xs text-muted-foreground mr-2">
          ({toFarsiNumber(averageRating.toFixed(1))})
        </span>
      ) : (
        <span className="text-xs text-muted-foreground mr-2">
          (بدون امتیاز)
        </span>
      )}
    </div>
  );
};

FeaturedProducts.displayName = 'FeaturedProducts';

export default FeaturedProducts;
