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

// EXTREMELY STRICT search algorithm - Only exact substring matches
export const calculateRelevanceScore = (product: Product, query: string): number => {
  const normalizedQuery = normalizeText(query.trim());
  const normalizedTitle = normalizeText(product.title);
  const normalizedDesc = normalizeText(product.description || '');
  
  // Must be at least 2 characters
  if (normalizedQuery.length < 2) {
    return 0;
  }
  
  // ONLY exact substring matches - no word splitting
  
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
  
  // Exact description match
  if (normalizedDesc === normalizedQuery) {
    return 300;
  }
  
  // Description starts with query
  if (normalizedDesc.startsWith(normalizedQuery)) {
    return 200;
  }
  
  // Description contains complete query as substring
  if (normalizedDesc.includes(normalizedQuery)) {
    return 100;
  }
  
  // NO OTHER MATCHING - reject everything else
  return 0;
};

// EXTREMELY STRICT search function
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
  const { limit = 10, minScore = 100, includeCategories = false, categoryGetter } = options;
  
  if (!query.trim() || query.length < 2) {
    return [];
  }
  
  // Calculate relevance scores for all products
  let scoredProducts = products
    .map(product => ({
      product,
      score: calculateRelevanceScore(product, query)
    }))
    .filter(item => item.score >= minScore);
  
  // NO category matching to avoid confusion
  // Categories will only be matched if explicitly requested and with exact matches
  
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
};

// EXTREMELY STRICT filtering function
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
    const normalizedDesc = normalizeText(product.description || '');
    
    // ONLY exact substring matches - NO word-by-word matching at all
    return normalizedTitle.includes(normalizedQuery) || 
           normalizedDesc.includes(normalizedQuery);
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

export const createSearchResults = (
  products: Product[],
  query: string,
  categoryGetter: (categoryId: string) => string,
  limit: number = 8
): SearchResult[] => {
  const searchedProducts = searchProducts(products, query, {
    limit,
    includeCategories: false, // Disable category matching completely
    categoryGetter
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