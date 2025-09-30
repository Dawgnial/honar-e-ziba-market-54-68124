import { Product } from '@/types';

// Persian text normalization for better search
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ی/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/ة/g, 'ه')
    .replace(/آ/g, 'ا')
    .trim();
};

// Search algorithm - ONLY searches in product titles/names
export const calculateRelevanceScore = (product: Product, query: string): number => {
  const normalizedQuery = normalizeText(query.trim());
  const normalizedTitle = normalizeText(product.title);
  
  // Must be at least 2 characters
  if (normalizedQuery.length < 2) {
    return 0;
  }
  
  // ONLY search in product title - NEVER in description or other fields
  
  // Exact title match (highest priority)
  if (normalizedTitle === normalizedQuery) {
    return 1000;
  }
  
  // Title starts with query (very high priority)
  if (normalizedTitle.startsWith(normalizedQuery)) {
    return 600;
  }
  
  // Title contains complete query as substring (high priority)
  if (normalizedTitle.includes(normalizedQuery)) {
    return 400;
  }
  
  // NO MATCH - reject everything else
  // Descriptions and other fields are NOT searched
  return 0;
};

// Search function - ONLY searches in product titles/names
export const searchProducts = (
  products: Product[],
  query: string,
  options: {
    limit?: number;
    minScore?: number;
    includeCategories?: boolean;
    categoryGetter?: (categoryId: string) => string;
  } = {}
): Product[] => {
  const { limit = 10, minScore = 100 } = options;
  
  if (!query.trim() || query.length < 2) {
    return [];
  }
  
  // Calculate relevance scores for all products (title only)
  let scoredProducts = products
    .map(product => ({
      product,
      score: calculateRelevanceScore(product, query)
    }))
    .filter(item => item.score >= minScore);
  
  // Sort by relevance and return top results
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

// Filtering function - ONLY searches in product titles/names
export const filterProductsBySearch = (products: Product[], searchQuery: string): Product[] => {
  if (!searchQuery.trim()) {
    return products;
  }
  
  const normalizedQuery = normalizeText(searchQuery.trim());
  
  // Must be at least 2 characters
  if (normalizedQuery.length < 2) {
    return products;
  }
  
  return products.filter(product => {
    const normalizedTitle = normalizeText(product.title);
    
    // ONLY search in product title - NEVER in description or other fields
    return normalizedTitle.includes(normalizedQuery);
  });
};

// Create search result object for dropdown displays
export interface SearchResult {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  price?: number;
  description?: string;
}

// Create search results - only from product titles
export const createSearchResults = (
  products: Product[],
  query: string,
  categoryGetter: (categoryId: string) => string,
  limit: number = 8
): SearchResult[] => {
  const searchedProducts = searchProducts(products, query, {
    limit
  });
  
  return searchedProducts.map(product => ({
    id: String(product.id),
    title: product.title,
    imageUrl: product.imageUrl,
    category: categoryGetter(product.category_id),
    price: product.price,
    description: product.description
  }));
};