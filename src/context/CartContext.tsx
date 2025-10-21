
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../models/Product";
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends Product {
  quantity: number;
  selectedAttributes?: Array<{
    attribute_id: string;
    attribute_value_id: string;
    attribute_name: string;
    attribute_display_name: string;
    value: string;
    display_value: string;
    price_modifier: number;
  }>;
  uniqueKey?: string; // To differentiate items with different attributes
}

interface CartContextType {
  items: CartItem[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (uniqueKey: string) => void;
  clearCart: () => void;
  increaseQuantity: (uniqueKey: string) => void;
  decreaseQuantity: (uniqueKey: string) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getItemQuantity: (uniqueKey: string) => number;
}

const defaultCartContext: CartContextType = {
  items: [],
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  getCartTotal: () => 0,
  getCartItemsCount: () => 0,
  getItemQuantity: () => 0,
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        // SECURITY: Don't log cart parsing errors
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      // Create unique key for cart item based on product ID and selected attributes
      const attributesKey = (product as any).selectedAttributes 
        ? JSON.stringify((product as any).selectedAttributes.map((attr: any) => attr.attribute_value_id).sort())
        : '';
      const uniqueKey = `${product.id}_${attributesKey}`;
      
      const existingItem = prevCart.find((item) => item.uniqueKey === uniqueKey);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.uniqueKey === uniqueKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newItem: CartItem = {
        ...product,
        quantity,
        selectedAttributes: (product as any).selectedAttributes || [],
        uniqueKey
      };
      
      return [...prevCart, newItem];
    });

    toast({
      title: "به سبد خرید اضافه شد",
      description: `${product.title} به سبد خرید شما اضافه شد.`,
      variant: "default",
      duration: 2000,
    });
  };

  // Remove from cart
  const removeFromCart = (uniqueKey: string) => {
    setCart((prev) => prev.filter((item) => item.uniqueKey !== uniqueKey));
    toast({
      title: "از سبد خرید حذف شد",
      variant: "default",
      duration: 2000,
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast({
      title: "سبد خرید خالی شد",
      variant: "default",
      duration: 2000,
    });
  };

  // Increase quantity
  const increaseQuantity = (uniqueKey: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.uniqueKey === uniqueKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (uniqueKey: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.uniqueKey === uniqueKey && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Use the price from the item (which is already calculated correctly in ProductDetail)
      const itemPrice = item.price;
      
      const discountedPrice = item.discount_percentage 
        ? itemPrice * (1 - item.discount_percentage / 100)
        : itemPrice;
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Get item quantity
  const getItemQuantity = (uniqueKey: string) => {
    const item = cart.find((item) => item.uniqueKey === uniqueKey);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items: cart, // For backward compatibility
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getCartItemsCount,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
