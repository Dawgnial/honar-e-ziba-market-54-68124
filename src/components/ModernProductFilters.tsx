
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImprovedRangeSlider } from "@/components/ui/improved-range-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, X, ChevronDown, RotateCcw } from "lucide-react";
import { Product } from "@/types";
import { Category } from "../hooks/useSupabaseCategories";
import { formatPriceToFarsi } from "../utils/numberUtils";

export interface FilterState {
  searchQuery: string;
  priceRange: [number, number];
  categories: string[];
  featuredOnly: boolean;
  availableOnly: boolean;
  sortBy: string;
}

interface ModernProductFiltersProps {
  products: Product[];
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isMobile?: boolean;
}

const ModernProductFilters = ({ 
  products, 
  categories, 
  filters, 
  onFiltersChange, 
  isMobile = false 
}: ModernProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minPrice, setMinPrice] = useState(0);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000000]);
  const [localSearchQuery, setLocalSearchQuery] = useState(""); // Initialize empty, don't sync with filters.searchQuery
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

  // محاسبه دینامیک محدوده قیمت بر اساس محصولات موجود
  useEffect(() => {
    if (products.length > 0) {
      // فیلتر کردن محصولات با قیمت معتبر
      const validPrices = products
        .map(p => {
          // اگر تخفیف داشته باشد، قیمت تخفیف‌خورده را محاسبه کن
          const discountedPrice = p.discount_percentage 
            ? p.price * (1 - p.discount_percentage / 100)
            : p.price;
          return discountedPrice;
        })
        .filter(price => price > 0);

      if (validPrices.length > 0) {
        const calculatedMin = Math.floor(Math.min(...validPrices));
        const calculatedMax = Math.ceil(Math.max(...validPrices));
        
        setMinPrice(calculatedMin);
        setMaxPrice(calculatedMax);
        setLocalPriceRange([calculatedMin, calculatedMax]);
        
        // تنظیم محدوده فیلتر فقط اگر هنوز تنظیم نشده باشد
        if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000000) {
          onFiltersChange({
            ...filters,
            priceRange: [calculatedMin, calculatedMax]
          });
        }
      }
    }
  }, [products]);

  // همگام‌سازی محدوده قیمت محلی با فیلتر
  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  // Initialize local search only once from URL params, don't sync with filters changes
  useEffect(() => {
    if (localSearchQuery === "" && filters.searchQuery) {
      setLocalSearchQuery(filters.searchQuery);
    }
  }, []);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    updateFilters({ categories: newCategories });
  };

  // اعمال تأخیر برای بهبود تجربه کاربری
  const [priceUpdateTimeout, setPriceUpdateTimeout] = useState<NodeJS.Timeout>();
  
  const handlePriceRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalPriceRange(newRange);
    
    // پاک کردن تایمر قبلی
    if (priceUpdateTimeout) {
      clearTimeout(priceUpdateTimeout);
    }
    
    // اعمال تأخیر 300 میلی‌ثانیه برای روان‌تر شدن
    const timeout = setTimeout(() => {
      updateFilters({ priceRange: newRange });
    }, 300);
    
    setPriceUpdateTimeout(timeout);
  };

  // مدیریت جستجو با debounce
  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    
    // پاک کردن تایمر قبلی
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // اعمال تأخیر 500 میلی‌ثانیه برای جستجو
    const timeout = setTimeout(() => {
      updateFilters({ searchQuery: value });
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const clearFilters = () => {
    const resetRange: [number, number] = [minPrice, maxPrice];
    setLocalPriceRange(resetRange);
    setLocalSearchQuery(''); // Reset local search
    updateFilters({
      searchQuery: '',
      priceRange: resetRange,
      categories: [],
      featuredOnly: false,
      availableOnly: false,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.categories.length > 0 ||
    filters.featuredOnly ||
    filters.availableOnly ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">مرتب‌سازی</Label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500">
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

      {/* Price Range با بهبود عملکرد */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">محدوده قیمت</Label>
        <div className="px-2">
          <ImprovedRangeSlider
            value={localPriceRange}
            onValueChange={handlePriceRangeChange}
            max={maxPrice}
            min={minPrice}
            step={Math.max(1000, Math.ceil((maxPrice - minPrice) / 200))}
            className="w-full"
          />
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
              {formatPriceToFarsi(localPriceRange[0])} تومان
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
              {formatPriceToFarsi(localPriceRange[1])} تومان
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-sm font-medium">دسته‌بندی</Label>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {category.title}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Filters */}
      <div className="space-y-3">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="available-only"
              checked={filters.availableOnly}
              onCheckedChange={(checked) => updateFilters({ availableOnly: checked as boolean })}
            />
            <Label htmlFor="available-only" className="text-sm font-normal cursor-pointer">
              فقط محصولات موجود
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="featured-only"
              checked={filters.featuredOnly}
              onCheckedChange={(checked) => updateFilters({ featuredOnly: checked as boolean })}
            />
            <Label htmlFor="featured-only" className="text-sm font-normal cursor-pointer">
              فقط محصولات ویژه
            </Label>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">فیلترهای فعال</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-3 w-3 ml-1" />
              پاک کردن همه
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.searchQuery && (
              <Badge variant="secondary" className="text-xs">
                جستجو: {filters.searchQuery}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => {
                    setLocalSearchQuery('');
                    updateFilters({ searchQuery: '' });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.categories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {category.title}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleCategoryChange(categoryId, false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
            {filters.availableOnly && (
              <Badge variant="secondary" className="text-xs">
                فقط موجود
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => updateFilters({ availableOnly: false })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.featuredOnly && (
              <Badge variant="secondary" className="text-xs">
                فقط ویژه
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => updateFilters({ featuredOnly: false })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
              <Badge variant="secondary" className="text-xs">
                قیمت: {formatPriceToFarsi(filters.priceRange[0])} - {formatPriceToFarsi(filters.priceRange[1])}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => {
                    const resetRange: [number, number] = [minPrice, maxPrice];
                    setLocalPriceRange(resetRange);
                    updateFilters({ priceRange: resetRange });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              فیلتر ها
            </div>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {filters.categories.length + (filters.featuredOnly ? 1 : 0) + (filters.availableOnly ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-hidden z-[10000]">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 pb-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <SheetTitle className="text-right text-base">فیلتر ها</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 h-0">
              <div className="p-4">
                <FilterContent />
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فیلتر ها
          </div>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {filters.categories.length + (filters.featuredOnly ? 1 : 0) + (filters.availableOnly ? 1 : 0)} فیلتر
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
};

export default ModernProductFilters;
