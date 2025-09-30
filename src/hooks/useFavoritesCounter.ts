
import { useFavorites } from '../context/FavoritesContext';

export const useFavoritesCounter = () => {
  const { favorites } = useFavorites();
  
  return {
    totalFavorites: favorites.length,
  };
};
