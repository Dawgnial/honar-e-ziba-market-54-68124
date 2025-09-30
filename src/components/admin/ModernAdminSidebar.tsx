
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  Grid3X3,
  LogOut,
  Menu,
  X,
  Home,
  MessageCircle
} from "lucide-react";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface ModernAdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const ModernAdminSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }: ModernAdminSidebarProps) => {
  const { signOut } = useSupabaseAuth();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('status', 'pending');
        
        if (!error && data) {
          setOrdersCount(data.length);
        }
      } catch (error) {
        console.error('Error fetching orders count:', error);
      }
    };

    fetchOrdersCount();
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "داشبورد",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "products",
      label: "محصولات",
      icon: Package,
      badge: null,
    },
    {
      id: "categories",
      label: "دسته‌بندی‌ها",
      icon: Grid3X3,
      badge: null,
    },
    {
      id: "users",
      label: "کاربران",
      icon: Users,
      badge: null,
    },
    {
      id: "comments",
      label: "مدیریت نظرات",
      icon: MessageCircle,
      badge: null,
    },
    {
      id: "reports",
      label: "گزارشات",
      icon: BarChart3,
      badge: null,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleBackToSite = () => {
    window.location.href = '/';
  };

  return (
    <div className={cn(
      "relative bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-full",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-persian-blue to-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">پنل مدیریت</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">ایرولیا شاپ</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {/* Back to Site Button */}
          <Button
            variant="ghost"
            onClick={handleBackToSite}
            className={cn(
              "w-full justify-start gap-3 h-11 font-vazir transition-all duration-200 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <Home className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
            {!collapsed && <span className="flex-1 text-right">بازگشت به سایت</span>}
          </Button>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full justify-start gap-3 h-11 font-vazir transition-all duration-200",
                  collapsed ? "px-2" : "px-3",
                  isActive 
                    ? "bg-gradient-to-r from-persian-blue to-blue-600 text-white hover:from-persian-blue/90 hover:to-blue-600/90 shadow-lg" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-11 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
            collapsed ? "px-2" : "px-3"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
          {!collapsed && <span className="flex-1 text-right">خروج</span>}
        </Button>
      </div>
    </div>
  );
};

export default ModernAdminSidebar;
