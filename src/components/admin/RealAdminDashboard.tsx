
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  ShoppingCart, 
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Eye
} from "lucide-react";
import { useSupabaseProducts } from "../../hooks/useSupabaseProducts";
import { useSupabaseCategories } from "../../hooks/useSupabaseCategories";
import { supabase } from "@/integrations/supabase/client";

const RealAdminDashboard = () => {
  const { products, loading: productsLoading } = useSupabaseProducts();
  const { categories, loading: categoriesLoading } = useSupabaseCategories();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!productsLoading && !categoriesLoading) {
      calculateStats();
    }
  }, [products, orders, users, productsLoading, categoriesLoading]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const calculateStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = orders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    setDashboardStats({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">در انتظار</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">تکمیل شده</Badge>;
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">ارسال شده</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">لغو شده</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' تومان';
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-persian-blue to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">خوش آمدید به پنل مدیریت!</h1>
            <p className="text-blue-100">آمار و گزارش‌های فروشگاه ایرولیا</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">آخرین بروزرسانی</p>
            <p className="font-semibold">{formatDate(new Date().toISOString())}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">تعداد کاربران</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">تعداد محصولات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalProducts}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">تعداد دسته‌بندی‌ها</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Recent Products */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Package className="h-5 w-5" />
            محصولات اخیر
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>هنوز محصولی اضافه نشده است</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                   <div className="aspect-square relative">
                     <img
                       src={(() => {
                         if (product.image_url) {
                           try {
                             const parsed = JSON.parse(product.image_url);
                             return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : product.image_url;
                           } catch {
                             return product.image_url;
                           }
                         }
                         return '/placeholder.svg';
                       })()}
                       alt={product.title}
                       className="w-full h-full object-cover"
                     />
                    {product.is_featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">ویژه</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {categories.find(c => c.id === product.category_id)?.title || 'بدون دسته‌بندی'}
                    </p>
                    <p className="font-bold text-persian-blue">{formatCurrency(product.price || 0)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealAdminDashboard;
