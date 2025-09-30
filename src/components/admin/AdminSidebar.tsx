
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  Grid3X3,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const AdminSidebar = ({ activeTab, onTabChange, className }: SidebarProps) => {
  const { signOut } = useSupabaseAuth();

  const menuItems = [
    {
      id: "dashboard",
      label: "داشبورد",
      icon: Home,
    },
    {
      id: "products",
      label: "محصولات",
      icon: Package,
    },
    {
      id: "categories",
      label: "دسته‌بندی‌ها",
      icon: Grid3X3,
    },
    {
      id: "orders",
      label: "سفارشات",
      icon: ShoppingCart,
    },
    {
      id: "users",
      label: "کاربران",
      icon: Users,
    },
    {
      id: "reports",
      label: "گزارشات",
      icon: BarChart3,
    },
    {
      id: "settings",
      label: "تنظیمات",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <Sidebar className={cn("bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700", className)}>
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">پنل مدیریت</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 dark:text-gray-400">منوی اصلی</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      isActive={isActive}
                      className={cn(
                        "w-full justify-start gap-3 text-right font-vazir hover:bg-gray-100 dark:hover:bg-gray-700",
                        isActive && "bg-persian-blue dark:bg-persian-medium text-white hover:bg-persian-blue/90 dark:hover:bg-persian-medium/90"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>خروج</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
