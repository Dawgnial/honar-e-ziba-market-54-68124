import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProductsWithTags = (products: any[], selectedTagIds: string[]) => {
  const [tagProductIds, setTagProductIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTagIds.length === 0) {
      setTagProductIds(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const filterByTags = async () => {
      try {
        const { data: productTags } = await supabase
          .from('product_tags')
          .select('product_id')
          .in('tag_id', selectedTagIds);

        if (!cancelled) {
          setTagProductIds(productTags?.map(pt => pt.product_id) || []);
        }
      } catch (error) {
        if (!cancelled) setTagProductIds(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    filterByTags();
    return () => { cancelled = true; };
  }, [selectedTagIds]);

  const filteredProducts = useMemo(() => {
    if (tagProductIds === null) return products;
    return products.filter(p => tagProductIds.includes(p.id));
  }, [products, tagProductIds]);

  return { filteredProducts, loading };
};
