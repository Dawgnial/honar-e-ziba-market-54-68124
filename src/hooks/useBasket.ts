
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';

interface BasketItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  title: string;
}

export const useBasket = () => {
  const { user } = useSupabaseAuth();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addToBasket = (product: any, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newItem = {
        id: Date.now().toString(),
        productId: product.id,
        quantity,
        price: product.price || 0,
        title: product.title
      };
      
      return [...prev, newItem];
    });
  };

  const removeFromBasket = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    items,
    loading,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    total,
    count: items.length
  };
};
