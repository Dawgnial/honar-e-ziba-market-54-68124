
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseProducts } from "../../hooks/useSupabaseProducts";
import { useSupabaseCategories } from "../../hooks/useSupabaseCategories";
import { toFarsiNumber } from "../../utils/numberUtils";
interface ProductSale {
  quantity: number;
  revenue: number;
  product: any;
}

interface CategoryStat {
  name: string;
  products: number;
  sales: number;
  revenue: number;
}

const RealAdminReports = () => {
  const { products } = useSupabaseProducts();
  const { categories } = useSupabaseCategories();
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState("this_month");

  useEffect(() => {
    fetchReportData();
  }, [reportPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    switch (reportPeriod) {
      case "today":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: now
        };
      case "this_week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return { start: startOfWeek, end: now };
      case "this_month":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now
        };
      case "last_month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start: lastMonth, end: endLastMonth };
      default:
        return { start: new Date(0), end: now };
    }
  };

  const filterDataByPeriod = (data: any[], dateField: string = 'created_at') => {
    const { start, end } = getDateRange();
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const calculateStats = () => {
    const filteredOrders = filterDataByPeriod(orders);
    const filteredUsers = filterDataByPeriod(users);

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = filteredOrders.length;
    const newUsers = filteredUsers.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      newUsers,
      avgOrderValue,
      completedOrders: filteredOrders.filter(o => o.status === 'delivered').length,
      pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
    };
  };

  const getTopProducts = (): ProductSale[] => {
    const productSales: Record<string, ProductSale> = {};
    orders.forEach(order => {
      if (order.order_items) {
        order.order_items.forEach((item: any) => {
          const productId = item.product_id;
          if (!productSales[productId]) {
            productSales[productId] = {
              quantity: 0,
              revenue: 0,
              product: products.find(p => p.id === productId)
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.total_price;
        });
      }
    });

    return Object.values(productSales)
      .filter((item: ProductSale) => item.product)
      .sort((a: ProductSale, b: ProductSale) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const getCategoryStats = (): CategoryStat[] => {
    const categoryStats: Record<string, CategoryStat> = {};
    
    categories.forEach(category => {
      categoryStats[category.id] = {
        name: category.title,
        products: products.filter(p => p.category_id === category.id).length,
        sales: 0,
        revenue: 0
      };
    });

    orders.forEach(order => {
      if (order.order_items) {
        order.order_items.forEach((item: any) => {
          const product = products.find(p => p.id === item.product_id);
          if (product && product.category_id) {
            if (categoryStats[product.category_id]) {
              categoryStats[product.category_id].sales += item.quantity;
              categoryStats[product.category_id].revenue += item.total_price;
            }
          }
        });
      }
    });

    return Object.values(categoryStats).sort((a: CategoryStat, b: CategoryStat) => b.revenue - a.revenue);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' تومان';
  };

  const getPeriodLabel = () => {
    const labels: Record<string, string> = {
      today: "امروز",
      this_week: "این هفته",
      this_month: "این ماه",
      last_month: "ماه گذشته",
      all_time: "کل دوره"
    };
    return labels[reportPeriod] || "کل دوره";
  };

  const stats = calculateStats();
  const topProducts = getTopProducts();
  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">گزارشات و آمار</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">تحلیل عملکرد فروشگاه - {getPeriodLabel()}</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">امروز</SelectItem>
              <SelectItem value="this_week">این هفته</SelectItem>
              <SelectItem value="this_month">این ماه</SelectItem>
              <SelectItem value="last_month">ماه گذشته</SelectItem>
              <SelectItem value="all_time">کل دوره</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            خروجی PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">کل فروش</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  نسبت به دوره قبل
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">تعداد سفارشات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{toFarsiNumber(stats.totalOrders)}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <ShoppingCart className="h-3 w-3" />
                  {toFarsiNumber(stats.completedOrders)} تکمیل شده
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">کاربران جدید</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{toFarsiNumber(stats.newUsers)}</p>
                <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                  <Users className="h-3 w-3" />
                  رشد کاربران
                </p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">میانگین سفارش</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.avgOrderValue)}
                </p>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <BarChart3 className="h-3 w-3" />
                  ارزش متوسط
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <Package className="h-5 w-5" />
              محصولات پرفروش
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>داده‌ای برای نمایش وجود ندارد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-800">{toFarsiNumber(index + 1)}</Badge>
                      <div>
                        <p className="font-medium text-sm">{item.product?.title}</p>
                        <p className="text-xs text-gray-500">{toFarsiNumber(item.quantity)} فروش</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{formatCurrency(item.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <BarChart3 className="h-5 w-5" />
              عملکرد دسته‌بندی‌ها
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {categoryStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>داده‌ای برای نمایش وجود ندارد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.slice(0, 5).map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{toFarsiNumber(category.products)} محصول</Badge>
                        <span className="text-sm font-semibold">{formatCurrency(category.revenue)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.max((category.revenue / Math.max(...categoryStats.map(c => c.revenue))) * 100, 5)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <ShoppingCart className="h-5 w-5" />
            وضعیت سفارشات - {getPeriodLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { status: "pending", label: "در انتظار", count: stats.pendingOrders, color: "bg-yellow-100 text-yellow-800" },
              { status: "processing", label: "در حال پردازش", count: orders.filter(o => o.status === 'processing').length, color: "bg-blue-100 text-blue-800" },
              { status: "shipped", label: "ارسال شده", count: orders.filter(o => o.status === 'shipped').length, color: "bg-purple-100 text-purple-800" },
              { status: "delivered", label: "تحویل شده", count: stats.completedOrders, color: "bg-green-100 text-green-800" },
              { status: "cancelled", label: "لغو شده", count: orders.filter(o => o.status === 'cancelled').length, color: "bg-red-100 text-red-800" },
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Badge className={`${item.color} mb-2`}>{item.label}</Badge>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{toFarsiNumber(item.count)}</p>
                <p className="text-xs text-gray-500">سفارش</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealAdminReports;
