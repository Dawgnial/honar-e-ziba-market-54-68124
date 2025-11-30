import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

// Transform database response to match Product interface
const transformProduct = (dbProduct: any): Product => {
  // Parse image URLs if they're stored as JSON string
  let imageUrl = dbProduct.image_url;
  if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
    try {
      const urls = JSON.parse(imageUrl);
      imageUrl = Array.isArray(urls) && urls.length > 0 ? urls[0] : imageUrl;
    } catch (e) {
      // Keep original if parsing fails
    }
  }

  return {
    id: dbProduct.id,
    title: dbProduct.title,
    description: dbProduct.description || '',
    price: dbProduct.price || 0,
    imageUrl: imageUrl || '',
    category_id: dbProduct.category_id,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at || dbProduct.created_at,
    is_featured: dbProduct.is_featured || false,
    discount_percentage: dbProduct.discount_percentage || 0,
    availability_status: dbProduct.availability_status || 'available',
  };
};

// Cache keys for different queries
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  FEATURED_PRODUCTS: 'featured-products',
  PRODUCT_BY_ID: 'product-by-id',
  PRODUCTS_BY_CATEGORY: 'products-by-category',
} as const;

// Optimized hook for all products with pagination
export const useOptimizedProducts = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, page, limit],
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          price,
          image_url,
          category_id,
          is_active,
          is_featured,
          stock,
          discount_percentage,
          availability_status,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      return {
        products: (data || []).map(transformProduct),
        totalCount: count || 0,
        hasMore: (count || 0) > to + 1,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Optimized hook for featured products only
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCTS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          price,
          image_url,
          category_id,
          is_active,
          is_featured,
          stock,
          discount_percentage,
          availability_status,
          created_at,
          updated_at
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return (data || []).map(transformProduct);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Optimized hook for single product
export const useOptimizedProduct = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_BY_ID, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? transformProduct(data) : null;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Optimized hook for products by category
export const useProductsByCategory = (categoryId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY, categoryId, page, limit],
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          price,
          image_url,
          category_id,
          is_active,
          is_featured,
          stock,
          discount_percentage,
          availability_status,
          created_at,
          updated_at
        `, { count: 'exact' })
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      return {
        products: (data || []).map(transformProduct),
        totalCount: count || 0,
        hasMore: (count || 0) > to + 1,
      };
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to invalidate product queries when needed
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateProducts: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
    invalidateFeaturedProducts: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEATURED_PRODUCTS] });
    },
    invalidateProduct: (id: string) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_BY_ID, id] });
    },
    invalidateProductsByCategory: (categoryId: string) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS_BY_CATEGORY, categoryId] });
    },
  };
};