
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { ReactNode, useState } from "react";
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

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-700" />
                <div className="hidden md:flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input 
                      placeholder="جستجو..." 
                      className="w-64 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* اعلانات */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="absolute -top-1 -left-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">اعلانات</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <DropdownMenuItem className="p-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">سفارش جدید</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">سفارش #1001 ثبت شد</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">5 دقیقه پیش</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">موجودی کم</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">عطر زعفرانی موجودی کم دارد</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">10 دقیقه پیش</p>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* پروفایل کاربر */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-persian-blue dark:bg-persian-medium text-white">
                          A
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <DropdownMenuItem className="text-gray-900 dark:text-gray-100">
                      <User className="h-4 w-4 ml-2 text-gray-600 dark:text-gray-400" />
                      پروفایل
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-900 dark:text-gray-100">
                      تنظیمات حساب
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      خروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* محتوای اصلی */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-80px)]">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
