
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ModernProductCard from "../components/ModernProductCard";
import NewProductFilters, { FilterState } from "../components/NewProductFilters";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "../components/SEOHead";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Grid, List, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toFarsiNumber } from "../utils/numberUtils";
import { filterProductsBySearch } from "../utils/searchUtils";



const Products = () => {
  const { products, loading: productsLoading, error: productsError, refetch } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    priceRange: [0, 1000000],
    categories: [],
    tags: [],
    featuredOnly: false,
    availableOnly: false,
    unavailableOnly: false,
    sortBy: 'newest'
  });
  
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle category selection and search from navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    
    setFilters(prev => ({
      ...prev,
      categories: categoryId ? [categoryId] : [],
      searchQuery: searchQuery || ''
    }));
  }, [location.search]);


  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter with improved Persian text matching
    if (filters.searchQuery.trim()) {
      filtered = filterProductsBySearch(filtered, filters.searchQuery);
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category_id)
      );
    }

    // Price filter - use discounted price if available
    filtered = filtered.filter(product => {
      const discountedPrice = product.discount_percentage 
        ? product.price * (1 - product.discount_percentage / 100)
        : product.price;
      return discountedPrice >= filters.priceRange[0] && 
             discountedPrice <= filters.priceRange[1];
    });

    // Featured only filter
    if (filters.featuredOnly) {
      filtered = filtered.filter(product => product.is_featured);
    }

    // Available only filter
    if (filters.availableOnly) {
      filtered = filtered.filter(product => product.availability_status === 'available');
    }

    // Unavailable only filter
    if (filters.unavailableOnly) {
      filtered = filtered.filter(product => product.availability_status !== 'available');
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags && filters.tags.some(tag => product.tags.includes(tag))
      );
    }

    return filtered;
  }, [products, filters]);

  // Group products by category and sort within each group
  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    
    // Group products by category
    filteredProducts.forEach(product => {
      const categoryId = product.category_id || 'uncategorized';
      if (!groups[categoryId]) {
        groups[categoryId] = [];
      }
      groups[categoryId].push(product);
    });

    // Sort products within each group based on sortBy
    Object.keys(groups).forEach(categoryId => {
      const categoryProducts = groups[categoryId];
      
      switch (filters.sortBy) {
        case 'priceAsc':
          categoryProducts.sort((a, b) => {
            const priceA = a.discount_percentage ? a.price * (1 - a.discount_percentage / 100) : a.price;
            const priceB = b.discount_percentage ? b.price * (1 - b.discount_percentage / 100) : b.price;
            return priceA - priceB;
          });
          break;
        case 'priceDesc':
          categoryProducts.sort((a, b) => {
            const priceA = a.discount_percentage ? a.price * (1 - a.discount_percentage / 100) : a.price;
            const priceB = b.discount_percentage ? b.price * (1 - b.discount_percentage / 100) : b.price;
            return priceB - priceA;
          });
          break;
        case 'popular':
          categoryProducts.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
          break;
        case 'featured':
          categoryProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
          break;
        default: // newest
          categoryProducts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
    });

    // Sort categories by name (alphabetically)
    const sortedCategoryIds = Object.keys(groups).sort((a, b) => {
      const categoryA = categories.find(cat => cat.id === a);
      const categoryB = categories.find(cat => cat.id === b);
      const nameA = categoryA ? categoryA.title : (a === 'uncategorized' ? 'سایر محصولات' : '');
      const nameB = categoryB ? categoryB.title : (b === 'uncategorized' ? 'سایر محصولات' : '');
      return nameA.localeCompare(nameB, 'fa');
    });

    return sortedCategoryIds.map(categoryId => ({
      categoryId,
      categoryName: categories.find(cat => cat.id === categoryId)?.title || 'سایر محصولات',
      products: groups[categoryId]
    }));
  }, [filteredProducts, categories, filters.sortBy]);


  const handleAddToCart = async (product: Product) => {
    try {
      // Check if product is available before adding to cart
      const isAvailable = product.availability_status === 'available';
      
      if (!isAvailable) {
        toast({
          title: "خطا",
          description: "این محصول در حال حاضر موجود نیست",
          variant: "destructive",
        });
        return;
      }

      // Add the product to cart using the cart context
      addToCart(product, 1);
      
      toast({
        title: "موفقیت",
        description: `${product.title} به سبد خرید اضافه شد`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "خطا",
        description: "مشکلی در افزودن محصول به سبد خرید رخ داد",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast({
        title: "حذف شد",
        description: "محصول از لیست علاقه‌مندی‌ها حذف شد",
      });
    } else {
      addToFavorites(product);
      toast({
        title: "اضافه شد",
        description: "محصول به لیست علاقه‌مندی‌ها اضافه شد",
      });
    }
  };

  const handleRetry = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "به‌روزرسانی شد",
        description: "محصولات با موفقیت به‌روزرسانی شدند",
      });
    } catch (error) {
      console.error('Error refreshing:', error);
      toast({
        title: "خطا",
        description: "مشکلی در به‌روزرسانی محصولات رخ داد",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = productsLoading || categoriesLoading;
  const hasError = productsError;

  if (hasError) {
    return (
      <Layout className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">خطا در بارگذاری</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {productsError || 'مشکلی در دریافت اطلاعات رخ داده است'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={handleRetry} 
                  disabled={isRefreshing}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                      در حال بارگذاری...
                    </>
                  ) : (
                    'تلاش مجدد'
                  )}
                </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              بازگشت به خانه
            </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-gray-50 dark:bg-gray-900">
      <SEOHead 
        title="محصولات سفال و سرامیک و صنایع دستی | ایرولیا شاپ"
        description="مشاهده و خرید بهترین محصولات سفال و سرامیک، لعاب، زیرلعابی و ابزار هنری. بیش از 100 محصول با کیفیت عالی و قیمت مناسب."
        keywords="محصولات سفالی, لعاب سفال و سرامیک, زیرلعابی, ابزار سفال و سرامیک, صنایع دستی"
        url="https://iroliashop.com/products"
        breadcrumbs={[
          { name: "محصولات", url: "/products", isActive: true }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[{ name: "محصولات", url: "/products", isActive: true }]}
          className="mb-6"
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            فروشگاه محصولات
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            کشف کنید، انتخاب کنید و از خرید لذت ببرید
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <NewProductFilters
              products={products}
              categories={categories}
              filters={filters}
              onFiltersChange={setFilters}
              isMobile={isMobile}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{toFarsiNumber(filteredProducts.length)}</span> محصول یافت شد
                </p>
                {filters.searchQuery && (
                  <span className="text-sm text-gray-500">
                    برای "{filters.searchQuery}"
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sort on mobile */}
                <div className="sm:hidden">
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                    <SelectTrigger className="w-40">
                      <ArrowUpDown className="w-4 h-4 ml-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">جدیدترین</SelectItem>
                      <SelectItem value="priceAsc">قیمت: کم به زیاد</SelectItem>
                      <SelectItem value="priceDesc">قیمت: زیاد به کم</SelectItem>
                      <SelectItem value="popular">محبوب‌ترین</SelectItem>
                      <SelectItem value="featured">ویژه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products by Category */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : groupedProducts.length > 0 ? (
              <div className="space-y-12">
                {groupedProducts.map((group) => (
                  <div key={group.categoryId} className="space-y-6">
                    {/* Category Header */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {group.categoryName}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {toFarsiNumber(group.products.length)} محصول
                      </p>
                    </div>
                    
                    {/* Category Products */}
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                      {group.products.map((product) => (
                        <ModernProductCard
                          key={product.id}
                          product={product}
                          categories={categories}
                          onAddToCart={() => handleAddToCart(product)}
                          onToggleFavorite={() => handleToggleFavorite(product)}
                          isFavorite={isFavorite(product.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      هیچ محصولی یافت نشد
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {filters.searchQuery 
                        ? `برای "${filters.searchQuery}" محصولی یافت نشد`
                        : filters.categories.length > 0 
                          ? 'در دسته‌بندی انتخاب شده محصولی موجود نیست'
                          : 'فیلترهای خود را تغییر دهید و دوباره تلاش کنید'
                      }
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({
                        searchQuery: '',
                        priceRange: [0, 1000000],
                        categories: [],
                        tags: [],
                        featuredOnly: false,
                        availableOnly: false,
                        unavailableOnly: false,
                        sortBy: 'newest'
                      })}
                    >
                      پاک کردن فیلترها
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
