
import { Heart, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import { toFarsiNumber } from "@/utils/numberUtils";

const NavbarActions = () => {
  const { items } = useCart();
  const { favorites } = useFavorites();
  const { user, userProfile } = useSupabaseAuth();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Theme Toggle - only show on larger screens to avoid duplication */}
      <div className="hidden lg:block">
        <ThemeToggle />
      </div>

      {/* Favorites */}
      <Link to="/favorites">
        <Button variant="ghost" size="icon" className="relative hover-scale">
          <Heart className="h-5 w-5" />
          {favorites.length > 0 && (
            <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              {toFarsiNumber(favorites.length)}
            </Badge>
          )}
        </Button>
      </Link>

      {/* Cart */}
      <Link to="/cart">
        <Button variant="ghost" size="icon" className="relative hover-scale">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
              {toFarsiNumber(totalItems)}
            </Badge>
          )}
        </Button>
      </Link>

      {/* User Account */}
      <Link to={user ? "/" : "/auth"}>
        <Button variant="ghost" size="icon" className="hover-scale flex items-center gap-2">
          <User className="h-5 w-5" />
          {user && (
            <span className="hidden sm:inline text-sm font-medium max-w-20 truncate">
              {userProfile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'کاربر'}
            </span>
          )}
        </Button>
      </Link>
    </div>
  );
};

export default NavbarActions;
