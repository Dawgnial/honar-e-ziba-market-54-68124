import React, { memo, useMemo, useCallback, useState } from "react";
import { useOptimizedProducts } from "@/hooks/useOptimizedProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import OptimizedProductCard from "./OptimizedProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface VirtualizedProductListProps {
  categoryId?: string;
  searchQuery?: string;
  itemsPerPage?: number;
}

const VirtualizedProductList = memo(({ 
  categoryId, 
  searchQuery, 
  itemsPerPage = 20 
}: VirtualizedProductListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    data: productsData, 
    isLoading, 
    error,
    isFetching 
  } = useOptimizedProducts(currentPage, itemsPerPage);

  const { categories } = useCategories();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!productsData?.products) return [];
    
    let filtered = productsData.products;
    
    if (categoryId) {
      filtered = filtered.filter(product => product.category_id === categoryId);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [productsData?.products, categoryId, searchQuery]);

  const handleAddToCart = useCallback((product: any) => {
    try {
      addToCart(product, 1);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [addToCart]);

  const handleFavoriteToggle = useCallback((productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
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
  }, [filteredProducts, favorites, addToFavorites, removeFromFavorites]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalPages = Math.ceil((productsData?.totalCount || 0) / itemsPerPage);

  if (isLoading && currentPage === 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(itemsPerPage)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">خطا در بارگذاری محصولات</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">محصولی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFavorite = favorites.some(fav => fav.id === product.id);
            
            return (
              <OptimizedProductCard
                key={product.id}
                product={product}
                categories={categories}
                onAddToCart={() => handleAddToCart(product)}
                onFavoriteToggle={() => handleFavoriteToggle(product.id)}
                isFavorite={isFavorite}
                showRating={false} // Disable rating for performance
              />
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            className="ml-2"
          >
            <ChevronRight className="h-4 w-4" />
            قبلی
          </Button>
          
          <div className="flex items-center space-x-1">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNumber = Math.max(1, Math.min(
                totalPages - 4,
                Math.max(1, currentPage - 2)
              )) + index;
              
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={isFetching}
                  className="w-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
            className="mr-2"
          >
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Results info */}
      <div className="text-center text-sm text-muted-foreground">
        نمایش {((currentPage - 1) * itemsPerPage) + 1} تا {Math.min(currentPage * itemsPerPage, productsData?.totalCount || 0)} از {productsData?.totalCount || 0} محصول
      </div>
    </div>
  );
});

VirtualizedProductList.displayName = 'VirtualizedProductList';

export default VirtualizedProductList;