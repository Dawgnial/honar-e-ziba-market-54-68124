import { useSupabaseProducts } from './useSupabaseProducts';
import { useMemo } from 'react';
import type { Product } from '@/types';

export const useProducts = () => {
  const { products, loading, error, refetch, getProduct, createProduct, updateProduct, deleteProduct } = useSupabaseProducts();

  const transformedProducts = useMemo(() => {
    try {
      return products.map(product => {
        let imageUrl = '/placeholder.svg';
        
        if (product.image_url) {
          if (product.image_url.startsWith('[')) {
            try {
              const imageUrls = JSON.parse(product.image_url);
              if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                imageUrl = imageUrls[0];
              }
            } catch {
              imageUrl = '/placeholder.svg';
            }
          } else {
            imageUrl = product.image_url;
          }
        }
        
        return {
          id: product.id,
          title: product.title || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          imageUrl: imageUrl,
          category_id: product.category_id || '1',
          stock: Number(product.stock) || 0,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          is_featured: product.is_featured || false,
          discount_percentage: product.discount_percentage || 0,
          availability_status: product.availability_status || 'available',
        } as Product;
      });
    } catch (error) {
      console.error('Error transforming products:', error);
      return [];
    }
  }, [products]);

  return {
    products: transformedProducts,
    loading,
    error,
    refetch,
    getProduct: async (id: string) => {
      try {
        const product = await getProduct(id);
        
        let imageUrl = '/placeholder.svg';
        
        if (product.image_url) {
          if (product.image_url.startsWith('[')) {
            try {
              const imageUrls = JSON.parse(product.image_url);
              if (Array.isArray(imageUrls) && imageUrls.length > 0) {
                imageUrl = imageUrls[0];
              }
            } catch {
              imageUrl = '/placeholder.svg';
            }
          } else {
            imageUrl = product.image_url;
          }
        }
        
        return {
          id: product.id,
          title: product.title || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          imageUrl: imageUrl,
          category_id: product.category_id || '1',
          stock: Number(product.stock) || 0,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          is_featured: product.is_featured || false,
          discount_percentage: product.discount_percentage || 0,
          availability_status: product.availability_status || 'available',
        } as Product;
      } catch (error) {
        console.error('Error getting product:', error);
        throw error;
      }
    },
    createProduct,
    updateProduct,
    deleteProduct
  };
};
