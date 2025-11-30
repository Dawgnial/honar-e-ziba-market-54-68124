import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProductsWithTags = (products: any[], selectedTagIds: string[]) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filterByTags = async () => {
      if (selectedTagIds.length === 0) {
        setFilteredProducts(products);
        return;
      }

      setLoading(true);
      try {
        // Get all product IDs that have the selected tags
        const { data: productTags } = await supabase
          .from('product_tags')
          .select('product_id')
          .in('tag_id', selectedTagIds);

        if (productTags) {
          const productIds = productTags.map(pt => pt.product_id);
          const filtered = products.filter(p => productIds.includes(p.id));
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(products);
        }
      } catch (error) {
        console.error('Error filtering by tags:', error);
        setFilteredProducts(products);
      } finally {
        setLoading(false);
      }
    };

    filterByTags();
  }, [products, selectedTagIds]);

  return { filteredProducts, loading };
};
