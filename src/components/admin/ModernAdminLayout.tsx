
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import ModernAdminSidebar from "./ModernAdminSidebar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toFarsiNumber } from "../../utils/numberUtils";
// Import all components directly instead of using require()
import RealAdminDashboard from "./RealAdminDashboard";
import AdminProducts from "../../pages/AdminProducts";
import AdminCategories from "../../pages/AdminCategories";
import RealAdminOrders from "./RealAdminOrders";
import RealAdminUsers from "./RealAdminUsers";
import AdminTags from "../../pages/AdminTags";
import AdminComments from "../../pages/AdminComments";
import RealAdminReports from "./RealAdminReports";
import RealAdminSettings from "./RealAdminSettings";
import AdminSupport from "../../pages/AdminSupport";

interface ModernAdminLayoutProps {
  children?: ReactNode;
}

const ModernAdminLayout = ({ children }: ModernAdminLayoutProps = {}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get recent orders for notifications
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (!error && orders) {
          setRecentOrders(orders);
          // Count pending orders as notifications
          const pendingCount = orders.filter(order => order.status === 'pending').length;
          setNotificationsCount(pendingCount);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
      <ModernAdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <main className="flex-1 overflow-auto">
        {/* Modern Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input 
                      placeholder="جستجو در پنل مدیریت..." 
                      className="w-80 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Theme Toggle - only show on desktop */}
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      {notificationsCount > 0 && (
                        <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                          {toFarsiNumber(notificationsCount)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">اعلانات جدید</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {recentOrders.length > 0 ? (
                        recentOrders.slice(0, 3).map((order) => (
                          <DropdownMenuItem key={order.id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                  {order.status === 'pending' ? 'سفارش جدید' : 'به‌روزرسانی سفارش'}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString('fa-IR')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                سفارش #{order.id.slice(0, 8)} - {toFarsiNumber((order.total_amount?.toLocaleString()) ?? '0')} تومان
                              </p>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem className="p-4">
                          <div className="w-full text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">اعلانی وجود ندارد</p>
                          </div>
                        </DropdownMenuItem>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-to-r from-persian-blue to-blue-600 text-white">
                          م
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">مدیر سیستم</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">admin@iroliashop.com</p>
                    </div>
                    <DropdownMenuItem className="text-gray-900 dark:text-gray-100">
                      <User className="h-4 w-4 ml-2 text-gray-600 dark:text-gray-400" />
                      پروفایل
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-900 dark:text-gray-100">
                      تنظیمات حساب
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {children || (
            <>
              {activeTab === "dashboard" && <RealAdminDashboard />}
              {activeTab === "products" && <AdminProducts />}
              {activeTab === "categories" && <AdminCategories />}
              {activeTab === "tags" && <AdminTags />}
              {activeTab === "orders" && <RealAdminOrders />}
              {activeTab === "users" && <RealAdminUsers />}
              {activeTab === "support" && <AdminSupport />}
              {activeTab === "comments" && <AdminComments />}
              {activeTab === "reports" && <RealAdminReports />}
              {activeTab === "settings" && <RealAdminSettings />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModernAdminLayout;
