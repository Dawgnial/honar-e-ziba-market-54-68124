
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/types";
import { toFarsiNumber, formatPriceToFarsi } from "../utils/numberUtils";
import { searchProducts } from "../utils/searchUtils";

interface ProductSearchProps {
  products: Product[];
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const ProductSearch = ({ products, onSearch, searchQuery }: ProductSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // Memoized suggestions with extremely strict search logic
  const suggestions = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return []; // Minimum 2 characters
    
    return searchProducts(products, inputValue.trim(), { 
      limit: 6,
      minScore: 100 // Strict minimum score
    });
  }, [products, inputValue]);

  // Debounced search function
  const debouncedSearch = useCallback((value: string) => {
    setIsLoading(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(value);
      setIsLoading(false);
    }, 300);
  }, [onSearch]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Sync with external searchQuery changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
    
    if (value.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setIsOpen(false);
    inputRef.current?.blur();
    // Navigate to product detail page instead of just searching
    navigate(`/product/${product.id}`);
  };

  const clearSearch = () => {
    setInputValue("");
    onSearch("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="جستجو در محصولات..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pr-12 pl-12 py-3 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all duration-200 bg-white dark:bg-gray-800"
          onFocus={() => {
            if (inputValue.trim().length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
        />
        
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader className="h-4 w-4 animate-spin text-gray-400" />
          )}
          {inputValue && (
            <Button
              onClick={clearSearch}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full max-h-80 overflow-y-auto z-50 shadow-xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-2">
            {suggestions.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSuggestionClick(product)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-terracotta transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {product.description}
                  </p>
                  <p className="text-sm font-semibold text-terracotta">
                    {product.price > 0 ? `${formatPriceToFarsi(product.price)} تومان` : 'ناموجود'}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-terracotta transition-colors" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Search footer */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {toFarsiNumber(suggestions.length)} نتیجه از {toFarsiNumber(products.length)} محصول
            </p>
          </div>
        </Card>
      )}

      {/* No results message */}
      {isOpen && inputValue.trim().length >= 2 && suggestions.length === 0 && !isLoading && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-6 text-center">
            <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              هیچ محصولی برای "{inputValue}" یافت نشد
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
