import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBox } from "./navbar/SearchBox";
import MobileMenu from "./navbar/MobileMenu";
import { toFarsiNumber } from "../utils/numberUtils";

const Navbar = () => {
  const { user, isAdmin } = useSupabaseAuth();
  const { items } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const navItems = [
    { 
      name: "صفحه اصلی", 
      href: "/", 
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    },
    { 
      name: "محصولات", 
      href: "/products", 
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (location.pathname !== "/products") {
          window.location.href = "/products";
        }
      }
    },
    { 
      name: "دسته‌بندی‌ها", 
      href: "/#categories", 
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToSection("categories");
      }
    },
    { 
      name: "دوره آموزشی", 
      href: "/#training", 
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToSection("training");
      }
    },
    { 
      name: "تماس با ما", 
      href: "/about#contact", 
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        if (location.pathname !== "/about") {
          window.location.href = "/about#contact";
        } else {
          scrollToSection("contact");
        }
      }
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-0 right-0 z-[9998] dark:bg-gray-900/95 dark:border-gray-700/50 font-vazir shadow-lg w-full">
      <div className="container mx-auto px-4 w-full max-w-7xl">
        {/* Main Header */}
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center min-w-0 flex-shrink">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 relative overflow-hidden rounded-lg bg-gradient-to-br from-green-primary to-green-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 flex-shrink-0">
                <img 
                  src="/lovable-uploads/8e827ed6-fd27-421f-b9c0-561156bc7445.png" 
                  alt="ایرولیا شاپ" 
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                />
              </div>
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="text-sm sm:text-lg lg:text-2xl font-bold text-green-primary font-vazir group-hover:text-green-secondary transition-colors duration-200 truncate">
                  ایرولیا شاپ
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block truncate">
                  همراه هنرمندان سفال و سرامیک
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center flex-1 justify-center max-w-2xl mx-8">
            <div className="flex items-center space-x-1 space-x-reverse bg-gray-50 dark:bg-gray-800 rounded-full px-6 py-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-primary hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all duration-200 whitespace-nowrap"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <SearchBox className="w-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Theme Toggle - Desktop Only */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* Favorites */}
            <Link to="/favorites">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800 group h-9 w-9 sm:h-10 sm:w-10"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-red-500 transition-colors duration-200" />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 text-white animate-pulse">
                    {favorites.length > 99 ? '+۹۹' : toFarsiNumber(favorites.length)}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Shopping Cart */}
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800 group h-9 w-9 sm:h-10 sm:w-10"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-green-primary transition-colors duration-200" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-xs bg-green-primary hover:bg-green-secondary text-white animate-bounce">
                    {totalItems > 99 ? '+۹۹' : toFarsiNumber(totalItems)}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            <Link to={user ? "/profile" : "/auth"}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gray-100 dark:hover:bg-gray-800 group h-9 w-9 sm:h-10 sm:w-10"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-blue-500 transition-colors duration-200" />
              </Button>
            </Link>

            {/* Admin Panel - if admin */}
            {user && isAdmin() && (
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden lg:flex border-green-primary text-green-primary hover:bg-green-primary hover:text-white transition-all duration-200"
                >
                  پنل مدیریت
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-3 animate-fade-in">
            <SearchBox 
              className="w-full" 
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
