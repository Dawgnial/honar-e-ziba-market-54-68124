
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCartCounter = () => {
  const { cart } = useContext(CartContext);
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    totalItems: getTotalItems(),
  };
};
