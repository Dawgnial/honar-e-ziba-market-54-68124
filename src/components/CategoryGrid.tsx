
import React, { useState, memo } from "react";
import { useCategories } from "../hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";

const CategoryGrid = memo(() => {
  const { categories, loading } = useCategories();
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  // Show 6 categories initially (2 rows of 3)
  const initialCount = 6;
  const displayedCategories = showAll ? categories : categories.slice(0, initialCount);
  const hasMoreCategories = categories.length > initialCount;

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-green-light/20 to-white dark:from-gray-800/20 dark:to-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="w-full rounded-2xl aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-green-light/20 to-white dark:from-gray-800/20 dark:to-gray-900 transition-colors duration-300">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-persian-blue dark:text-white mb-4 transition-colors duration-300" style={{ fontWeight: 900 }}>
            دسته‌بندی محصولات
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300" style={{ fontWeight: 400 }}>
            هر آنچه برای سفال و سرامیک نیاز دارید، مرتب و دسته‌بندی شده
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedCategories.map((category) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg overflow-hidden rounded-2xl shadow-lg"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="relative overflow-hidden rounded-t-2xl" style={{ paddingBottom: '75%' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-persian-blue/20 to-green-light/30 dark:from-gray-700/50 dark:to-gray-600/50">
                  {category.image_url ? (
                    <OptimizedImage
                      src={category.image_url}
                      alt={category.title}
                      priority={false}
                      aspectRatio="4/3"
                      className="group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/30 dark:bg-gray-600/30 flex items-center justify-center backdrop-blur-sm">
                        <Package className="w-12 h-12 text-persian-blue dark:text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl lg:text-3xl text-white mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500" style={{ fontWeight: 900 }}>
                    {category.title}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 text-sm px-4 py-2"
                  >
                    مشاهده محصولات
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hasMoreCategories && (
          <div className="text-center mt-12 px-4">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="w-auto max-w-xs mx-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border-persian-blue text-persian-blue dark:border-white dark:text-white hover:bg-persian-blue hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-300"
            >
              {showAll ? (
                <>
                  <ChevronUp className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate">نمایش کمتر</span>
                </>
              ) : (
                <>
                  <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="truncate">نمایش بیشتر</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});

CategoryGrid.displayName = 'CategoryGrid';

export default CategoryGrid;
