import { Product } from '@/types';

// Persian text normalization for better search with fuzzy matching
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ی/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/ة/g, 'ه')
    .replace(/آ/g, 'ا')
    .replace(/‌/g, ' ') // Replace zero-width non-joiner with space
    .trim();
};

// Calculate similarity between two strings (Levenshtein distance)
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance algorithm
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

// Enhanced search algorithm with fuzzy matching
export const calculateRelevanceScore = (product: Product, query: string): number => {
  const normalizedQuery = normalizeText(query.trim());
  const normalizedTitle = normalizeText(product.title);
  
  // Must be at least 2 characters
  if (normalizedQuery.length < 2) {
    return 0;
  }
  
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
  
  // Fuzzy matching - check similarity for typos
  const words = normalizedTitle.split(' ');
  const queryWords = normalizedQuery.split(' ');
  
  let maxSimilarity = 0;
  
  for (const word of words) {
    for (const queryWord of queryWords) {
      const similarity = calculateSimilarity(word, queryWord);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
  }
  
  // If similarity is above 70%, consider it a match
  if (maxSimilarity >= 0.7) {
    return Math.floor(maxSimilarity * 200);
  }
  
  // Check if query words appear in any order
  const allQueryWordsPresent = queryWords.every(qWord => 
    words.some(word => word.includes(qWord) || qWord.includes(word))
  );
  
  if (allQueryWordsPresent) {
    return 100;
  }
  
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