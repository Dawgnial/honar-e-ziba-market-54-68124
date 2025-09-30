import React, { memo, useCallback } from "react";
import { useFeaturedProducts } from "@/hooks/useOptimizedProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OptimizedProductCard from "./OptimizedProductCard";

const OptimizedFeaturedProducts = memo(() => {
  const { data: featuredProducts = [], isLoading, error } = useFeaturedProducts();
  const { categories } = useCategories();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleAddToCart = useCallback((product: any) => {
    try {
      addToCart(product, 1);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [addToCart]);

  const handleFavoriteToggle = useCallback((productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;

    const isFavorite = favorites.some(fav => fav.id === productId);
    
    try {
      if (isFavorite) {
        removeFromFavorites(productId);
        toast.success('محصول از علاقه‌مندی‌ها حذف شد');
      } else {
        addToFavorites(product);
        toast.success('محصول به علاقه‌مندی‌ها اضافه شد');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [featuredProducts, favorites, addToFavorites, removeFromFavorites]);

  const navigateToProducts = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
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

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-muted-foreground">خطا در بارگذاری محصولات ویژه</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              محصولات ویژه
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              در حال حاضر محصول ویژه‌ای موجود نیست
            </p>
          </div>
          <div className="text-center">
            <Button 
              className="bg-primary hover:bg-primary/90 px-8 py-3"
              onClick={navigateToProducts}
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
            const isFavorite = favorites.some(fav => fav.id === product.id);
            
            return (
              <OptimizedProductCard
                key={product.id}
                product={product}
                categories={categories}
                onAddToCart={() => handleAddToCart(product)}
                onFavoriteToggle={() => handleFavoriteToggle(product.id)}
                isFavorite={isFavorite}
                showRating={false} // Don't load ratings for performance
              />
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-primary hover:bg-primary/90 px-8 py-3"
            onClick={navigateToProducts}
          >
            <ShoppingCart className="ml-2" size={20} />
            مشاهده تمام محصولات
          </Button>
        </div>
      </div>
    </section>
  );
});

OptimizedFeaturedProducts.displayName = 'OptimizedFeaturedProducts';

export default OptimizedFeaturedProducts;