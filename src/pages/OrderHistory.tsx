import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, Phone, Mail, Package, ArrowRight } from "lucide-react";
import { useOrderHistory } from "../hooks/useOrderHistory";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { toFarsiNumber } from "../utils/numberUtils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEOHead } from "../components/SEOHead";
import { DownloadInvoiceButton } from "../components/DownloadInvoiceButton";

const OrderHistory = () => {
  const { orders, loading } = useOrderHistory();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="container-custom py-8 min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="تاریخچه سفارشات - ایرولیا شاپ"
        description="مشاهده تاریخچه کامل سفارشات خود در فروشگاه ایرولیا شاپ. پیگیری فاکتورها و جزئیات خریدهای قبلی."
        keywords="تاریخچه سفارشات, فاکتور, پیگیری سفارش, ایرولیا شاپ"
      />
      
      <div className="container-custom py-8 min-h-[70vh]">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/profile">
              <ArrowRight className="w-4 h-4 ml-1" />
              بازگشت به پروفایل
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">تاریخچه سفارشات</h1>
          <p className="text-muted-foreground">
            مشاهده کامل فاکتورها و سفارشات قبلی شما
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                <FileText className="w-12 h-12 absolute inset-0 m-auto text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تاریخچه سفارشات خالی است</h3>
              <p className="text-muted-foreground mb-6">
                هنوز هیچ سفارشی ثبت نکرده‌اید. پس از صدور اولین فاکتور، تاریخچه شما اینجا نمایش داده خواهد شد.
              </p>
              <Button asChild>
                <Link to="/products">شروع خرید</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      فاکتور شماره {toFarsiNumber(order.invoice_number)}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
                      </div>
                      <Badge variant="secondary">
                        {toFarsiNumber(order.total_amount.toLocaleString())} تومان
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">اطلاعات مشتری</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{order.customer_name}</span>
                        </div>
                        {order.customer_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span dir="ltr">{order.customer_phone}</span>
                          </div>
                        )}
                        {order.customer_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span dir="ltr" className="text-xs">{order.customer_email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-2 space-y-3">
                      <h4 className="font-medium text-foreground">اقلام سفارش</h4>
                      <div className="space-y-2">
                        {order.order_data.items?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.imageUrl || '/placeholder.svg'} 
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded-md border"
                              />
                              <div>
                                <p className="font-medium text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  تعداد: {toFarsiNumber(item.quantity)}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {toFarsiNumber((item.price * item.quantity).toLocaleString())} تومان
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                        <span className="font-bold">جمع کل:</span>
                        <span className="font-bold text-primary text-lg">
                          {toFarsiNumber(order.total_amount.toLocaleString())} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-muted/30 flex justify-end gap-2">
                  <DownloadInvoiceButton order={order} />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;