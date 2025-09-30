
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { InvoicePDF } from '../components/InvoicePDF';
import CartRecommendations from '../components/CartRecommendations';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, FileText, Download, CheckCircle, UserPlus, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { toFarsiNumber } from "../utils/numberUtils";
import { useOrderHistory } from "../hooks/useOrderHistory";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { toast } from 'sonner';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    getCartTotal, 
    clearCart,
    getCartItemsCount 
  } = useCart();
  
  const { user } = useSupabaseAuth();
  const { addToHistory } = useOrderHistory();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const form = useForm();
  
  // Removed coupon functionality

  const handleGenerateInvoice = async () => {
    setIsGeneratingPDF(true);
    try {
      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
      
      // Create Persian date
      const persianDate = new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date());

      // Generate PDF
      await InvoicePDF.generate({
        items: cart,
        subtotal,
        total,
        invoiceNumber,
        date: persianDate
      });

      // Add to order history only for authenticated users
      try {
        if (user) {
          await addToHistory({
            user_id: user.id,
            order_data: { items: cart, subtotal, total },
            total_amount: total,
            customer_name: user.user_metadata?.name || 'مشتری',
            customer_phone: user.phone || undefined,
            customer_email: user.email || undefined,
            invoice_number: invoiceNumber
          });
        }
      } catch (historyError) {
        console.error('Error adding to history:', historyError);
        // Don't fail the whole process if history fails
      }

      // Show success message
      setShowSuccessMessage(true);
      
      // Clear cart after 3 seconds and redirect to Telegram
      setTimeout(() => {
        clearCart();
        setShowSuccessMessage(false);
        window.open('https://t.me/irolia', '_blank');
      }, 3000);

    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('خطا در تولید فاکتور');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="container-custom py-12 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
            <ShoppingBag className="w-12 h-12 absolute inset-0 m-auto text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h1>
          <p className="mb-6 text-muted-foreground">
            محصول مورد نظر خود را به سبد خرید اضافه کنید و از خرید لذت ببرید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/products">مشاهده محصولات</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">بازگشت به صفحه اصلی</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const subtotal = getCartTotal();
  const total = subtotal;
  
  return (
    <div className="container-custom py-8 pt-[calc(3.5rem+2rem)] sm:pt-[calc(4rem+2rem)] lg:pt-[calc(5rem+2rem)] min-h-[70vh]">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
        >
          <Link to="/products">
            <ArrowRight className="w-4 h-4 ml-1" />
            بازگشت به محصولات
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">سبد خرید شما</h1>
        <p className="text-muted-foreground mt-2">
          {toFarsiNumber(getCartItemsCount())} محصول در سبد خرید شما موجود است
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-primary/10">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="text-lg flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                جزئیات سفارش
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">محصول</TableHead>
                      <TableHead className="text-center">قیمت</TableHead>
                      <TableHead className="text-center">تعداد</TableHead>
                      <TableHead className="text-center">جمع</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.imageUrl || '/placeholder.svg'} 
                              alt={item.title} 
                              className="w-16 h-16 object-cover rounded-md border shadow-sm"
                            />
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                              {item.selectedAttributes && item.selectedAttributes.length > 0 && (
                                <div className="mt-1">
                                  {item.selectedAttributes.map((attr, index) => (
                                    <span key={index} className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mr-1 mb-1">
                                      {attr.attribute_display_name}: {attr.display_value}
                                      {attr.price_modifier > 0 && ` (+${toFarsiNumber(attr.price_modifier.toLocaleString())} تومان)`}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const attributeModifiers = item.selectedAttributes?.reduce((sum, attr) => sum + attr.price_modifier, 0) || 0;
                            const finalPrice = item.price + attributeModifiers;
                            const discountedPrice = item.discount_percentage 
                              ? finalPrice * (1 - item.discount_percentage / 100)
                              : finalPrice;
                            return `${toFarsiNumber(discountedPrice.toLocaleString())} تومان`;
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border rounded-md">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-none text-muted-foreground"
                              onClick={() => decreaseQuantity(item.uniqueKey || item.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-10 text-center">
                                {toFarsiNumber(item.quantity)}
                              </span>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-none text-muted-foreground"
                                onClick={() => increaseQuantity(item.uniqueKey || item.id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {(() => {
                            const attributeModifiers = item.selectedAttributes?.reduce((sum, attr) => sum + attr.price_modifier, 0) || 0;
                            const finalPrice = item.price + attributeModifiers;
                            const discountedPrice = item.discount_percentage 
                              ? finalPrice * (1 - item.discount_percentage / 100)
                              : finalPrice;
                            return `${toFarsiNumber((discountedPrice * item.quantity).toLocaleString())} تومان`;
                          })()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeFromCart(item.uniqueKey || item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Mobile view */}
              <div className="md:hidden divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex gap-4 mb-3">
                      <img 
                        src={item.imageUrl || '/placeholder.svg'} 
                        alt={item.title} 
                        className="w-20 h-20 object-cover rounded-md border shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.title}</h3>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeFromCart(item.uniqueKey || item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {item.description}
                        </p>
                        {item.selectedAttributes && item.selectedAttributes.length > 0 && (
                          <div className="mb-2">
                            {item.selectedAttributes.map((attr, index) => (
                              <span key={index} className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mr-1 mb-1">
                                {attr.attribute_display_name}: {attr.display_value}
                                {attr.price_modifier > 0 && ` (+${toFarsiNumber(attr.price_modifier.toLocaleString())} تومان)`}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-muted-foreground">قیمت: </span>
                            <span>
                              {(() => {
                                const attributeModifiers = item.selectedAttributes?.reduce((sum, attr) => sum + attr.price_modifier, 0) || 0;
                                const finalPrice = item.price + attributeModifiers;
                                const discountedPrice = item.discount_percentage 
                                  ? finalPrice * (1 - item.discount_percentage / 100)
                                  : finalPrice;
                                return `${toFarsiNumber(discountedPrice.toLocaleString())} تومان`;
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center border rounded-md">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-none text-muted-foreground"
                              onClick={() => decreaseQuantity(item.uniqueKey || item.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {toFarsiNumber(item.quantity)}
                            </span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-none text-muted-foreground"
                              onClick={() => increaseQuantity(item.uniqueKey || item.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <div className="font-medium">
                        <span className="text-muted-foreground text-sm">جمع: </span>
                        <span>
                          {(() => {
                            const attributeModifiers = item.selectedAttributes?.reduce((sum, attr) => sum + attr.price_modifier, 0) || 0;
                            const finalPrice = item.price + attributeModifiers;
                            const discountedPrice = item.discount_percentage 
                              ? finalPrice * (1 - item.discount_percentage / 100)
                              : finalPrice;
                            return `${toFarsiNumber((discountedPrice * item.quantity).toLocaleString())} تومان`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end border-t p-4">
              <Button
                variant="outline"
                className="text-red-500"
                onClick={clearCart}
              >
                <Trash2 className="ml-2 h-4 w-4" />
                پاک کردن سبد خرید
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <Card className="border-primary/10">
              <CardHeader className="bg-primary/5 pb-3">
                <CardTitle className="text-lg">خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>تعداد اقلام:</span>
                    <span>{toFarsiNumber(getCartItemsCount())}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>جمع کالاها:</span>
                    <span>{toFarsiNumber(subtotal.toLocaleString())} تومان</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center font-bold">
                    <span>جمع نهایی:</span>
                    <span className="text-lg text-primary">{toFarsiNumber(total.toLocaleString())} تومان</span>
                  </div>
                </div>
              </CardContent>
              
              <CardContent className="pt-0 p-4">
                {showSuccessMessage ? (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        فاکتور با موفقیت تولید شد!
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-300 mb-3">
                        فاکتور در دانلودهای شما ظاهر شد و به تاریخچه اضافه شد
                      </p>
                      <p className="text-xs text-muted-foreground">
                        برای ادامه خرید به تلگرام منتقل می‌شوید...
                      </p>
                    </div>
                  </div>
                ) : !user ? (
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        برای ثبت سفارش باید وارد حساب کاربری شوید
                      </p>
                    </div>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90">
                      <Link to="/auth">
                        <LogIn className="ml-2 h-4 w-4" />
                        ورود / ثبت‌نام
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 hover-scale" 
                    onClick={handleGenerateInvoice}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Download className="ml-2 h-4 w-4 animate-spin" />
                        در حال تولید فاکتور...
                      </>
                    ) : (
                      <>
                        <FileText className="ml-2 h-4 w-4" />
                        صدور فاکتور
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Product suggestions */}
      <CartRecommendations />
    </div>
  );
};

export default Cart;
