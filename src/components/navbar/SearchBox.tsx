
import { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock } from 'lucide-react';
import { SearchResult } from "@/types/search";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import { createSearchResults } from '../../utils/searchUtils';

interface SearchBoxProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SearchBox({ className, isOpen, onClose }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { products } = useProducts();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const debouncedSearch = useDebouncedCallback((query: string) => {
    if (query.trim().length >= 2) {
      setIsLoading(true);
      setShowResults(true);

      const getCategoryName = (categoryId: string): string => {
        const category = categories.find(c => c.id === categoryId);
        return category?.title || 'دسته‌بندی نامشخص';
      };

      const results = createSearchResults(products, query, getCategoryName, 6);
      setSearchResults(results);
      setIsLoading(false);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch, products, categories]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery('');
      if (onClose) onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(result.title);
    setShowResults(false);
    setSearchQuery('');
    // Navigate to product detail page using the product ID
    navigate(`/product/${result.id}`);
    if (onClose) onClose();
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    navigate(`/products?search=${encodeURIComponent(search)}`);
    setShowResults(false);
    if (onClose) onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className={className} ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="جستجو در میان محصولات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.length >= 2 || recentSearches.length > 0) {
                setShowResults(true);
              }
            }}
            className="pr-12 pl-4 h-11 bg-muted border-border focus:border-primary focus:ring-primary rounded-full text-right placeholder:text-right"
            dir="rtl"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-primary hover:text-primary-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-muted"
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-card rounded-xl border border-border shadow-xl max-h-80 overflow-y-auto z-50 animate-fade-in">
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="mr-3 text-sm text-muted-foreground">در حال جستجو...</span>
            </div>
          ) : (
            <>
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="p-2">
                  <h4 className="text-xs font-semibold text-muted-foreground px-3 py-2 border-b border-border">
                    نتایج جستجو
                  </h4>
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors duration-150 group"
                      onClick={() => handleResultClick(result)}
                    >
                      <img
                        src={result.imageUrl}
                        alt={result.title}
                        className="w-10 h-10 object-cover rounded-lg mr-3 group-hover:scale-105 transition-transform duration-150"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {result.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{result.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {searchQuery.length < 2 && recentSearches.length > 0 && (
                <div className="p-2 border-t border-border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <h4 className="text-xs font-semibold text-muted-foreground">
                      جستجوهای اخیر
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      پاک کردن
                    </Button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors duration-150 group"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <Clock className="w-4 h-4 text-muted-foreground mr-3" />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {search}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">موردی یافت نشد.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    کلمات کلیدی دیگری امتحان کنید
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
