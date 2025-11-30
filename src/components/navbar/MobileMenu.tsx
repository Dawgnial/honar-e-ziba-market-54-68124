
import { X, Home, Package, Info, Phone, Heart, ShoppingCart, User, Sun, Moon, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import { useTheme } from "@/components/ThemeProvider";
import { SearchBox } from "./SearchBox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toFarsiNumber } from "../../utils/numberUtils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { items } = useCart();
  const { favorites } = useFavorites();
  const { user, isAdmin } = useSupabaseAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const scrollToSection = (sectionId: string) => {
    onClose();
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full max-w-sm p-0 bg-white dark:bg-gray-900 [&>button]:hidden z-[10000]"
      >
        <div className="flex flex-col h-screen">
          {/* Header with Logo and Close Button - Fixed */}
          <SheetHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-primary to-green-secondary p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                  <img 
                    src="/lovable-uploads/8e827ed6-fd27-421f-b9c0-561156bc7445.png" 
                    alt="ایرولیا شاپ" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <SheetTitle className="text-xl font-vazir font-bold text-white text-right">
                    ایرولیا شاپ
                  </SheetTitle>
                  <SheetDescription className="text-white/80 text-sm text-right">
                    همراه هنرمندان سفال و سرامیک
                  </SheetDescription>
                </div>
              </div>
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20 rounded-full h-10 w-10"
                >
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          {/* Scrollable Content Container */}
          <ScrollArea className="flex-1">
            <div className="bg-white dark:bg-gray-900 pb-8">
            {/* Search Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <SearchBox className="w-full" onClose={onClose} />
            </div>
            
            {/* Navigation Links */}
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 text-right">
                دسترسی سریع
              </h3>
              
              <Link
                to="/"
                className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                onClick={onClose}
              >
                <div className="w-12 h-12 bg-green-primary/10 rounded-xl flex items-center justify-center group-hover:bg-green-primary/20 transition-colors">
                  <Home className="h-6 w-6 text-green-primary" />
                </div>
                <span className="font-medium text-lg text-right flex-1">صفحه اصلی</span>
              </Link>
              
              <Link
                to="/products"
                className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                onClick={onClose}
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Package className="h-6 w-6 text-blue-500" />
                </div>
                <span className="font-medium text-lg text-right flex-1">محصولات</span>
              </Link>

              <button
                onClick={() => scrollToSection("categories")}
                className="w-full flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
                <span className="font-medium text-lg text-right flex-1">دسته‌بندی‌ها</span>
              </button>

              <Link
                to="/contact"
                className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                onClick={onClose}
              >
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <Phone className="h-6 w-6 text-pink-500" />
                </div>
                <span className="font-medium text-lg text-right flex-1">تماس با ما</span>
              </Link>

              <Link
                to="/about"
                className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                onClick={onClose}
              >
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                  <Info className="h-6 w-6 text-teal-500" />
                </div>
                <span className="font-medium text-lg text-right flex-1">درباره ما</span>
              </Link>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            {/* User Actions */}
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 text-right">
                حساب کاربری
              </h3>
              
              <Link
                to="/favorites"
                className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                onClick={onClose}
              >
                <div className="relative w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <Heart className="h-6 w-6 text-red-500" />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs bg-red-500 text-white font-bold">
                      {favorites.length > 99 ? '+۹۹' : toFarsiNumber(favorites.length)}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-row-reverse items-center justify-between flex-1">
                  {favorites.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {toFarsiNumber(favorites.length)} مورد
                    </span>
                  )}
                  <span className="font-medium text-lg">علاقه‌مندی‌ها</span>
                </div>
              </Link>
              
              <Link
                to="/cart"
                className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                onClick={onClose}
              >
                <div className="relative w-12 h-12 bg-green-primary/10 rounded-xl flex items-center justify-center group-hover:bg-green-primary/20 transition-colors">
                  <ShoppingCart className="h-6 w-6 text-green-primary" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs bg-green-primary text-white font-bold">
                      {totalItems > 99 ? '+۹۹' : toFarsiNumber(totalItems)}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-row-reverse items-center justify-between flex-1">
                  {totalItems > 0 && (
                    <span className="text-sm text-gray-500">
                      {toFarsiNumber(totalItems)} کالا
                    </span>
                  )}
                  <span className="font-medium text-lg">سبد خرید</span>
                </div>
              </Link>
              
              {user ? (
                <Link
                  to="/profile"
                  className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <User className="h-6 w-6 text-indigo-500" />
                  </div>
                  <span className="font-medium text-lg text-right flex-1">پروفایل کاربری</span>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <User className="h-6 w-6 text-indigo-500" />
                  </div>
                  <span className="font-medium text-lg text-right flex-1">ورود/ثبت نام</span>
                </Link>
              )}

              {user && isAdmin() && (
                <Link
                  to="/admin"
                  className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Settings className="h-6 w-6 text-amber-500" />
                  </div>
                  <span className="font-medium text-lg text-right flex-1">پنل مدیریت</span>
                </Link>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            
            {/* Theme Toggle */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 text-right">
                تنظیمات
              </h3>
              
              <button
                onClick={toggleTheme}
                className="w-full flex flex-row-reverse items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-foreground group"
              >
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  {theme === "dark" ? 
                    <Sun className="h-6 w-6 text-yellow-500" /> : 
                    <Moon className="h-6 w-6 text-yellow-500" />
                  }
                </div>
                <span className="font-medium text-lg text-right flex-1">
                  {theme === "dark" ? "حالت روشن" : "حالت تاریک"}
                </span>
              </button>
            </div>
          </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
