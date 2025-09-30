import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  Bell,
  Calendar
} from "lucide-react";
import { useSupabaseProducts } from "../../hooks/useSupabaseProducts";
import { useSupabaseCategories } from "../../hooks/useSupabaseCategories";
import { getCategoryName } from "../../utils/categoryUtils";
import QuickStats from "./QuickStats";
import { toFarsiNumber } from "../../utils/numberUtils";
import WelcomeMessage from "./WelcomeMessage";

const AdminDashboard = () => {
  const { products, loading: productsLoading } = useSupabaseProducts();
  const { categories, loading: categoriesLoading } = useSupabaseCategories();

  // موک دیتا برای سفارشات اخیر
  const recentOrders = [
    { id: "1001", customer: "احمد محمدی", amount: 450000, status: "pending", time: "10 دقیقه پیش" },
    { id: "1002", customer: "فاطمه احمدی", amount: 750000, status: "completed", time: "25 دقیقه پیش" },
    { id: "1003", customer: "علی رضایی", amount: 320000, status: "shipped", time: "1 ساعت پیش" },
  ];

  // موک دیتا برای محصولات موجودی کم
  const lowStockProducts = [
    { name: "عطر زعفرانی", stock: 3, minStock: 10 },
    { name: "عود هندی", stock: 1, minStock: 5 },
    { name: "گل محمدی", stock: 5, minStock: 15 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">در انتظار</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">تکمیل شده</Badge>;
      case "shipped":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">ارسال شده</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">داشبورد مدیریت</h1>
          <p className="text-gray-600">خلاصه‌ای از وضعیت فروشگاه شما</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          آخرین به‌روزرسانی: الان
        </div>
      </div>

      {/* Welcome Message */}
      <WelcomeMessage />

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              سفارشات اخیر
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">#{order.id}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{toFarsiNumber(order.amount.toLocaleString())}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              مشاهده همه سفارشات
            </Button>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              هشدارهای مهم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">موجودی کم</span>
                </div>
                <div className="space-y-2">
                  {lowStockProducts.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-xs text-gray-700">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(product.stock / product.minStock) * 100} className="w-12 h-2" />
                        <span className="text-xs text-red-600">{toFarsiNumber(product.stock)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">سیستم عادی کار می‌کند</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              عملیات سریع
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button 
                className="w-full bg-persian-blue hover:bg-persian-blue/90"
                onClick={() => window.location.href = '/admin/products'}
              >
                <Package className="h-4 w-4 ml-2" />
                افزودن محصول جدید
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/admin/categories'}
              >
                مدیریت دسته‌بندی‌ها
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/admin/orders'}
              >
                مشاهده سفارشات
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/admin/users'}
              >
                مدیریت کاربران
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            محصولات اخیر
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {product.category_id ? getCategoryName(product.category_id) : 'بدون دسته‌بندی'}
                    </p>
                    <p className="font-bold text-persian-blue">{toFarsiNumber((product.price?.toLocaleString()) ?? '0')} تومان</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/admin/products'}
            >
              مشاهده همه محصولات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
