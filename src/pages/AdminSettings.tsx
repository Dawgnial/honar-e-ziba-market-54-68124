
import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Store,
  Mail,
  Shield,
  Palette,
  Bell,
  Globe,
  CreditCard,
  Truck,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // تنظیمات فروشگاه
  const [storeSettings, setStoreSettings] = useState({
    storeName: "ایرولیا شاپ",
    storeDescription: "فروشگاه آنلاین عطر و ادکلن اصل",
    storeEmail: "info@airolia.shop",
    storePhone: "021-88888888",
    storeAddress: "تهران، خیابان ولیعصر، پلاک 123",
    currency: "تومان",
    timezone: "Asia/Tehran"
  });

  // تنظیمات ایمیل
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@airolia.shop",
    fromName: "ایرولیا شاپ"
  });

  // تنظیمات نوتیفیکیشن
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    customerRegistration: true
  });

  // تنظیمات پرداخت
  const [paymentSettings, setPaymentSettings] = useState({
    zarinpalEnabled: true,
    zarinpalMerchantId: "",
    paypalEnabled: false,
    paypalClientId: "",
    cryptoEnabled: false,
    cashOnDelivery: true
  });

  // تنظیمات ارسال
  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 500000,
    standardShippingCost: 25000,
    expressShippingCost: 45000,
    internationalShipping: false,
    shippingTax: 9
  });

  const handleSaveSettings = async (settingsType: string) => {
    setLoading(true);
    try {
      // اینجا کد ذخیره در API قرار می‌گیره
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تنظیمات ذخیره شد",
        description: `تنظیمات ${settingsType} با موفقیت به‌روزرسانی شد`,
      });
    } catch (error) {
      toast({
        title: "خطا در ذخیره تنظیمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">تنظیمات سیستم</h2>
            <p className="text-gray-600 mt-2">مدیریت تنظیمات کلی فروشگاه</p>
          </div>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              فروشگاه
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              اعلانات
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              ایمیل
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              پرداخت
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              ارسال
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              امنیت
            </TabsTrigger>
          </TabsList>

          {/* تنظیمات فروشگاه */}
          <TabsContent value="store">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-persian-blue to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  تنظیمات عمومی فروشگاه
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">نام فروشگاه</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">ایمیل فروشگاه</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">توضیحات فروشگاه</Label>
                  <Textarea
                    id="storeDescription"
                    value={storeSettings.storeDescription}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">تلفن تماس</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storePhone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">واحد پول</Label>
                    <Input
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeAddress">آدرس فروشگاه</Label>
                  <Textarea
                    id="storeAddress"
                    value={storeSettings.storeAddress}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
                    rows={2}
                  />
                </div>

                <Button 
                  onClick={() => handleSaveSettings("فروشگاه")} 
                  disabled={loading}
                  className="bg-persian-blue hover:bg-persian-blue/90"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تنظیمات اعلانات */}
          <TabsContent value="notifications">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  تنظیمات اعلانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor={key} className="text-sm font-medium">
                          {key === 'orderNotifications' && 'اعلان سفارشات جدید'}
                          {key === 'emailNotifications' && 'اعلانات ایمیلی'}
                          {key === 'smsNotifications' && 'اعلانات پیامکی'}
                          {key === 'pushNotifications' && 'اعلانات Push'}
                          {key === 'lowStockAlerts' && 'هشدار کمبود موجودی'}
                          {key === 'customerRegistration' && 'اعلان عضویت مشتریان جدید'}
                        </Label>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleSaveSettings("اعلانات")} 
                  disabled={loading}
                  className="bg-persian-blue hover:bg-persian-blue/90"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تنظیمات ایمیل */}
          <TabsContent value="email">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  تنظیمات ایمیل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">نام کاربری SMTP</Label>
                    <Input
                      id="smtpUser"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">رمز عبور SMTP</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">ایمیل فرستنده</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">نام فرستنده</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings("ایمیل")} 
                  disabled={loading}
                  className="bg-persian-blue hover:bg-persian-blue/90"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* سایر تب‌ها با محتوای مشابه */}
          <TabsContent value="payment">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  تنظیمات پرداخت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">درگاه زرین‌پال</Label>
                      <p className="text-xs text-gray-500">پرداخت آنلاین با کارت</p>
                    </div>
                    <Switch
                      checked={paymentSettings.zarinpalEnabled}
                      onCheckedChange={(checked) => 
                        setPaymentSettings(prev => ({ ...prev, zarinpalEnabled: checked }))
                      }
                    />
                  </div>
                  
                  {paymentSettings.zarinpalEnabled && (
                    <div className="space-y-2 mr-4">
                      <Label htmlFor="zarinpalMerchantId">Merchant ID زرین‌پال</Label>
                      <Input
                        id="zarinpalMerchantId"
                        value={paymentSettings.zarinpalMerchantId}
                        onChange={(e) => setPaymentSettings(prev => ({ ...prev, zarinpalMerchantId: e.target.value }))}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">پرداخت در محل</Label>
                      <p className="text-xs text-gray-500">پرداخت هنگام تحویل</p>
                    </div>
                    <Switch
                      checked={paymentSettings.cashOnDelivery}
                      onCheckedChange={(checked) => 
                        setPaymentSettings(prev => ({ ...prev, cashOnDelivery: checked }))
                      }
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings("پرداخت")} 
                  disabled={loading}
                  className="bg-persian-blue hover:bg-persian-blue/90"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  تنظیمات ارسال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">حد آزاد ارسال رایگان (تومان)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standardShippingCost">هزینه ارسال عادی (تومان)</Label>
                    <Input
                      id="standardShippingCost"
                      type="number"
                      value={shippingSettings.standardShippingCost}
                      onChange={(e) => setShippingSettings(prev => ({ ...prev, standardShippingCost: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleSaveSettings("ارسال")} 
                  disabled={loading}
                  className="bg-persian-blue hover:bg-persian-blue/90"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  تنظیمات امنیتی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">نکات امنیتی</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• رمز عبور قوی انتخاب کنید</li>
                      <li>• احراز هویت دو مرحله‌ای را فعال کنید</li>
                      <li>• به‌طور منظم بکاپ تهیه کنید</li>
                      <li>• دسترسی‌ها را مدیریت کنید</li>
                    </ul>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 ml-2" />
                    فعال‌سازی احراز هویت دو مرحله‌ای
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    تهیه بکاپ از اطلاعات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
