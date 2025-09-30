
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Truck, CheckCircle, Clock, Package2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toFarsiNumber } from "../utils/numberUtils";

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              title,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "خطا در دریافت سفارشات",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 ml-1" />
            در انتظار
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Truck className="h-3 w-3 ml-1" />
            ارسال شده
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 ml-1" />
            تحویل داده شده
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: "وضعیت سفارش به‌روزرسانی شد",
        description: `سفارش ${orderId} به وضعیت ${newStatus} تغییر کرد`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "خطا در به‌روزرسانی وضعیت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت سفارشات</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">مدیریت و پیگیری سفارشات مشتریان</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {toFarsiNumber(orders.length)} سفارش
          </div>
        </div>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">در انتظار</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {toFarsiNumber(orders.filter(o => o.status === 'pending').length)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">ارسال شده</p>
                <p className="text-2xl font-bold text-blue-900">
                  {toFarsiNumber(orders.filter(o => o.status === 'shipped').length)}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">تحویل شده</p>
                <p className="text-2xl font-bold text-green-900">
                  {toFarsiNumber(orders.filter(o => o.status === 'delivered').length)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">کل فروش</p>
                <p className="text-2xl font-bold text-purple-900">
                  {toFarsiNumber(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toLocaleString())}
                </p>
              </div>
              <Package2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-persian-blue to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            لیست سفارشات ({toFarsiNumber(orders.length)})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">هیچ سفارشی یافت نشد</h3>
              <p className="text-gray-500 dark:text-gray-400">هنوز سفارشی ثبت نشده است</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold">شماره سفارش</TableHead>
                  <TableHead className="font-semibold">مشتری</TableHead>
                  <TableHead className="font-semibold">محصولات</TableHead>
                  <TableHead className="font-semibold">مبلغ کل</TableHead>
                  <TableHead className="font-semibold">وضعیت</TableHead>
                  <TableHead className="font-semibold">تاریخ</TableHead>
                  <TableHead className="font-semibold">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.order_items?.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.products?.title} × {toFarsiNumber(item.quantity)}
                          </div>
                        )) || <span className="text-gray-400">بدون محصول</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {toFarsiNumber((order.total_amount?.toLocaleString()) ?? '0')} تومان
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">در انتظار</SelectItem>
                            <SelectItem value="shipped">ارسال شده</SelectItem>
                            <SelectItem value="delivered">تحویل شده</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
