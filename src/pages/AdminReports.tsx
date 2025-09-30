
import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  Calendar,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toFarsiNumber } from "../utils/numberUtils";

// موک دیتا برای گزارشات
const salesData = [
  { month: 'فروردین', sales: 12000000, orders: 45 },
  { month: 'اردیبهشت', sales: 18000000, orders: 67 },
  { month: 'خرداد', sales: 15000000, orders: 54 },
  { month: 'تیر', sales: 22000000, orders: 78 },
  { month: 'مرداد', sales: 25000000, orders: 89 },
  { month: 'شهریور', sales: 28000000, orders: 95 },
];

const categoryData = [
  { name: 'عطر زعفرانی', value: 35, color: '#8884d8' },
  { name: 'عود هندی', value: 25, color: '#82ca9d' },
  { name: 'گل محمدی', value: 20, color: '#ffc658' },
  { name: 'یاس', value: 15, color: '#ff7300' },
  { name: 'سایر', value: 5, color: '#00ff88' },
];

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  const stats = [
    {
      title: "کل فروش",
      value: "120,000,000",
      unit: "تومان",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "تعداد سفارشات",
      value: "428",
      unit: "سفارش",
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "مشتریان جدید",
      value: "89",
      unit: "نفر",
      change: "+15.3%",
      changeType: "increase",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "محصولات فروخته شده",
      value: "1,247",
      unit: "قطعه",
      change: "-2.1%",
      changeType: "decrease",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">گزارشات و آمار</h2>
            <p className="text-gray-600 mt-2">تحلیل و بررسی عملکرد فروشگاه</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">یک ماه اخیر</SelectItem>
                <SelectItem value="3months">سه ماه اخیر</SelectItem>
                <SelectItem value="6months">شش ماه اخیر</SelectItem>
                <SelectItem value="1year">یک سال اخیر</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 ml-2" />
              دانلود گزارش
            </Button>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {toFarsiNumber(stat.value)}
                    </p>
                    <p className="text-xs text-gray-500">{stat.unit}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}>
                    {toFarsiNumber(stat.change)}
                  </span>
                  <span className="text-xs text-gray-500 mr-2">نسبت به ماه قبل</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* نمودار فروش */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-persian-blue to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                روند فروش ماهانه
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name) => [
                      name === 'sales' ? `${toFarsiNumber(value.toLocaleString())} تومان` : `${toFarsiNumber(value)} سفارش`,
                      name === 'sales' ? 'فروش' : 'تعداد سفارش'
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="فروش"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                تعداد سفارشات ماهانه
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${toFarsiNumber(value)} سفارش`, 'تعداد سفارش']} />
                  <Bar dataKey="orders" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* نمودار دایره‌ای دسته‌بندی‌ها */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              فروش بر اساس دسته‌بندی
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${toFarsiNumber((percent * 100).toFixed(0))}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">جزئیات فروش</h3>
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* آمار تفصیلی */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">{toFarsiNumber(24)}</span>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">فروش امروز</h3>
                <p className="text-sm text-blue-600">{toFarsiNumber('2,450,000')} تومان</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-900">156</span>
              </div>
              <h3 className="font-semibold text-green-800 mb-2">بازدیدکنندگان امروز</h3>
              <p className="text-sm text-green-600">+12% نسبت به دیروز</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-900">89</span>
              </div>
              <h3 className="font-semibold text-purple-800 mb-2">محصولات فعال</h3>
              <p className="text-sm text-purple-600">در 8 دسته‌بندی</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
