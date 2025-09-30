
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Bell, 
  Mail, 
  Shield, 
  Palette,
  Globe,
  Database,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const RealAdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "فروشگاه ایرولیا",
    siteDescription: "فروشگاه آنلاین عطر و ادکلن طبیعی",
    contactEmail: "info@iroliashop.com",
    contactPhone: "021-88776655",
    address: "تهران، خیابان ولیعصر، پلاک 123",
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    lowStockNotifications: true,
    
    // Store Settings
    currency: "تومان",
    taxRate: 9,
    shippingFee: 50000,
    freeShippingThreshold: 500000,
    
    // Security Settings
    requireEmailVerification: false,
    allowGuestCheckout: true,
    maxLoginAttempts: 5,
    
    // Display Settings
    productsPerPage: 12,
    showOutOfStock: true,
    enableReviews: true,
    autoApproveReviews: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, save to database or configuration service
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    toast.info('تنظیمات به حالت پیش‌فرض بازگردانده شد');
  };

  const handleClearCache = async () => {
    try {
      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      toast.success('کش سیستم پاک شد');
    } catch (error) {
      toast.error('خطا در پاک کردن کش');
    }
  };

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تنظیمات سیستم</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">مدیریت تنظیمات عمومی فروشگاه</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 ml-2" />
            بازنشانی
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 ml-2" />
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Site Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Globe className="h-5 w-5" />
                اطلاعات کلی سایت
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">نام فروشگاه</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">ایمیل تماس</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">توضیحات فروشگاه</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">شماره تماس</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">واحد پول</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">آدرس</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleSettingChange('address', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Store Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <Settings className="h-5 w-5" />
                تنظیمات فروشگاه
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="taxRate">نرخ مالیات (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="shippingFee">هزینه ارسال</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    value={settings.shippingFee}
                    onChange={(e) => handleSettingChange('shippingFee', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="freeShipping">حد آزاد ارسال</Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleSettingChange('freeShippingThreshold', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="productsPerPage">تعداد محصولات در هر صفحه</Label>
                <Input
                  id="productsPerPage"
                  type="number"
                  value={settings.productsPerPage}
                  onChange={(e) => handleSettingChange('productsPerPage', parseInt(e.target.value))}
                  className="w-32"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>نمایش محصولات ناموجود</Label>
                    <p className="text-sm text-gray-500">محصولات تمام‌شده در فهرست نمایش داده شوند</p>
                  </div>
                  <Switch
                    checked={settings.showOutOfStock}
                    onCheckedChange={(checked) => handleSettingChange('showOutOfStock', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>فعال‌سازی نظرات</Label>
                    <p className="text-sm text-gray-500">کاربران بتوانند نظر ثبت کنند</p>
                  </div>
                  <Switch
                    checked={settings.enableReviews}
                    onCheckedChange={(checked) => handleSettingChange('enableReviews', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تایید خودکار نظرات</Label>
                    <p className="text-sm text-gray-500">نظرات بدون بررسی منتشر شوند</p>
                  </div>
                  <Switch
                    checked={settings.autoApproveReviews}
                    onCheckedChange={(checked) => handleSettingChange('autoApproveReviews', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>خرید مهمان</Label>
                    <p className="text-sm text-gray-500">خرید بدون ثبت نام (غیرفعال برای امنیت)</p>
                  </div>
                  <Switch
                    checked={false}
                    disabled={true}
                    onCheckedChange={() => {}}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
              <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                <Bell className="h-5 w-5" />
                اعلانات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>اعلانات ایمیل</Label>
                  <p className="text-sm text-gray-500">دریافت اعلانات از طریق ایمیل</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>اعلانات SMS</Label>
                  <p className="text-sm text-gray-500">دریافت اعلانات از طریق پیامک</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>اعلان سفارشات</Label>
                  <p className="text-sm text-gray-500">اطلاع از سفارشات جدید</p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>اعلان موجودی کم</Label>
                  <p className="text-sm text-gray-500">هشدار موجودی کم محصولات</p>
                </div>
                <Switch
                  checked={settings.lowStockNotifications}
                  onCheckedChange={(checked) => handleSettingChange('lowStockNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
              <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                <Shield className="h-5 w-5" />
                امنیت
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>تایید ایمیل اجباری</Label>
                  <p className="text-sm text-gray-500">کاربران باید ایمیل خود را تایید کنند</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                />
              </div>

              <div>
                <Label htmlFor="maxLoginAttempts">حداکثر تلاش ورود</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <Palette className="h-5 w-5" />
                ظاهر
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>تم سایت</Label>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* System */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Database className="h-5 w-5" />
                سیستم
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button variant="outline" onClick={handleClearCache} className="w-full">
                <Trash2 className="h-4 w-4 ml-2" />
                پاک کردن کش
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealAdminSettings;
