import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/ui/range-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, X, RotateCcw, ArrowUpDown } from "lucide-react";
import { Product } from "@/types";
import { Category } from "../hooks/useSupabaseCategories";
import { formatPriceToFarsi } from "../utils/numberUtils";

export interface FilterState {
  searchQuery: string;
  priceRange: [number, number];
  categories: string[];
  featuredOnly: boolean;
  availableOnly: boolean;
  unavailableOnly: boolean;
  sortBy: string;
}

interface NewProductFiltersProps {
  products: Product[];
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isMobile?: boolean;
}

const NewProductFilters = ({ 
  products, 
  categories, 
  filters, 
  onFiltersChange, 
  isMobile = false 
}: NewProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minPrice, setMinPrice] = useState(0);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000000]);
  const [priceUpdateTimeout, setPriceUpdateTimeout] = useState<NodeJS.Timeout>();

  // محاسبه دینامیک محدوده قیمت
  useEffect(() => {
    if (products.length > 0) {
      const validPrices = products
        .map(p => {
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
        
        if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000000) {
          onFiltersChange({
            ...filters,
            priceRange: [calculatedMin, calculatedMax]
          });
        }
      }
    }
  }, [products]);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    updateFilters({ categories: newCategories });
  };

  const handlePriceRangeChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalPriceRange(newRange);
    
    if (priceUpdateTimeout) {
      clearTimeout(priceUpdateTimeout);
    }
    
    const timeout = setTimeout(() => {
      updateFilters({ priceRange: newRange });
    }, 300);
    
    setPriceUpdateTimeout(timeout);
  };

  const clearFilters = () => {
    const resetRange: [number, number] = [minPrice, maxPrice];
    setLocalPriceRange(resetRange);
    updateFilters({
      searchQuery: '',
      priceRange: resetRange,
      categories: [],
      featuredOnly: false,
      availableOnly: false,
      unavailableOnly: false,
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.featuredOnly ||
    filters.availableOnly ||
    filters.unavailableOnly ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice;

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.featuredOnly ? 1 : 0) + 
    (filters.availableOnly ? 1 : 0) +
    (filters.unavailableOnly ? 1 : 0) +
    ((filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* فیلترهای فعال در بالا */}
      {hasActiveFilters && (
        <div className="space-y-3 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">فیلترهای فعال</span>
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {activeFiltersCount}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-3 w-3 ml-1" />
              پاک کردن همه
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <Badge 
                  key={categoryId} 
                  variant="default" 
                  className="h-7 px-3 text-xs gap-1.5 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {category.title}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleCategoryChange(categoryId, false)}
                  />
                </Badge>
              ) : null;
            })}
            {filters.availableOnly && (
              <Badge variant="default" className="h-7 px-3 text-xs gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                فقط موجود
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ availableOnly: false })}
                />
              </Badge>
            )}
            {filters.unavailableOnly && (
              <Badge variant="default" className="h-7 px-3 text-xs gap-1.5 bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20">
                فقط ناموجود
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ unavailableOnly: false })}
                />
              </Badge>
            )}
            {filters.featuredOnly && (
              <Badge variant="default" className="h-7 px-3 text-xs gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20">
                فقط ویژه
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ featuredOnly: false })}
                />
              </Badge>
            )}
            {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
              <Badge variant="default" className="h-7 px-3 text-xs gap-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">
                قیمت: {formatPriceToFarsi(filters.priceRange[0])} - {formatPriceToFarsi(filters.priceRange[1])}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const resetRange: [number, number] = [minPrice, maxPrice];
                    setLocalPriceRange(resetRange);
                    updateFilters({ priceRange: resetRange });
                  }}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* مرتب‌سازی جدا از فیلترها */}
      <div className="space-y-3 pb-4 border-b">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ArrowUpDown className="h-4 w-4" />
          مرتب‌سازی
        </div>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger className="h-10 bg-background border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-[10001]">
            <SelectItem value="newest">جدیدترین</SelectItem>
            <SelectItem value="priceAsc">قیمت: کم به زیاد</SelectItem>
            <SelectItem value="priceDesc">قیمت: زیاد به کم</SelectItem>
            <SelectItem value="popular">محبوب‌ترین</SelectItem>
            <SelectItem value="featured">ویژه</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accordion Filters */}
      <Accordion type="multiple" defaultValue={["categories", "availability", "price"]} className="space-y-1">
        {/* دسته‌بندی ها */}
        <AccordionItem value="categories" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-2">
              <span className="text-sm font-semibold">دسته‌بندی محصولات</span>
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="h-5 px-2 text-xs mr-2">
                  {filters.categories.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 space-x-reverse group">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer flex-1 group-hover:text-primary transition-colors"
                  >
                    {category.title}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* فیلتر موجودی و وضعیت */}
        <AccordionItem value="availability" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-2">
              <span className="text-sm font-semibold">موجودی و وضعیت</span>
              {(filters.availableOnly || filters.unavailableOnly || filters.featuredOnly) && (
                <Badge variant="secondary" className="h-5 px-2 text-xs mr-2">
                  {(filters.availableOnly ? 1 : 0) + (filters.unavailableOnly ? 1 : 0) + (filters.featuredOnly ? 1 : 0)}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center space-x-2 space-x-reverse group">
                <Checkbox
                  id="available-only"
                  checked={filters.availableOnly}
                  onCheckedChange={(checked) => updateFilters({ 
                    availableOnly: checked as boolean,
                    unavailableOnly: checked ? false : filters.unavailableOnly 
                  })}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <label 
                  htmlFor="available-only" 
                  className="text-sm cursor-pointer flex-1 group-hover:text-green-600 transition-colors"
                >
                  فقط محصولات موجود
                </label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse group">
                <Checkbox
                  id="unavailable-only"
                  checked={filters.unavailableOnly}
                  onCheckedChange={(checked) => updateFilters({ 
                    unavailableOnly: checked as boolean,
                    availableOnly: checked ? false : filters.availableOnly 
                  })}
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label 
                  htmlFor="unavailable-only" 
                  className="text-sm cursor-pointer flex-1 group-hover:text-red-600 transition-colors"
                >
                  فقط محصولات ناموجود
                </label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse group">
                <Checkbox
                  id="featured-only"
                  checked={filters.featuredOnly}
                  onCheckedChange={(checked) => updateFilters({ featuredOnly: checked as boolean })}
                  className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <label 
                  htmlFor="featured-only" 
                  className="text-sm cursor-pointer flex-1 group-hover:text-amber-600 transition-colors"
                >
                  فقط محصولات ویژه
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* محدوده قیمت */}
        <AccordionItem value="price" className="border rounded-lg px-4">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-2">
              <span className="text-sm font-semibold">محدوده قیمت</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="space-y-4 px-1" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              <RangeSlider
                value={localPriceRange}
                onValueChange={handlePriceRangeChange}
                max={maxPrice}
                min={minPrice}
                step={Math.max(1000, Math.ceil((maxPrice - minPrice) / 200))}
                className="w-full py-4"
              />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-muted-foreground mb-0.5">از</div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatPriceToFarsi(localPriceRange[0])}
                  </div>
                  <div className="text-xs text-muted-foreground">تومان</div>
                </div>
                <div className="text-muted-foreground">-</div>
                <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-muted-foreground mb-0.5">تا</div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatPriceToFarsi(localPriceRange[1])}
                  </div>
                  <div className="text-xs text-muted-foreground">تومان</div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-11 border-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">فیلترها</span>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="h-5 px-2 text-xs bg-primary">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-hidden z-[10000]">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 pb-3 border-b flex-shrink-0">
              <SheetTitle className="text-right text-lg font-bold flex items-center justify-between">
                <span>فیلترها</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="h-6 px-2 text-xs">
                    {activeFiltersCount} فیلتر
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 h-0">
              <div className="p-4">
                <FilterContent />
              </div>
            </ScrollArea>
            <div className="p-4 border-t flex-shrink-0">
              <Button 
                className="w-full h-11" 
                onClick={() => setIsOpen(false)}
              >
                اعمال فیلترها
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="sticky top-4 overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg">فیلترها</span>
          </div>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="h-6 px-3 text-xs bg-primary">
              {activeFiltersCount} فیلتر
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <FilterContent />
      </CardContent>
    </Card>
  );
};

export default NewProductFilters;
