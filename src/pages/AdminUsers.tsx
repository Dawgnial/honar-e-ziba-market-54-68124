
import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit, Trash2, Shield, ShieldCheck, ShieldX } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// موک دیتا برای کاربران
const mockUsers = [
  {
    id: "1",
    name: "احمد محمدی",
    email: "ahmad@example.com",
    phone: "09123456789",
    role: "admin",
    status: "active",
    createdAt: "2024-01-10T10:30:00Z",
    lastLogin: "2024-01-15T14:20:00Z",
    avatar: ""
  },
  {
    id: "2",
    name: "فاطمه احمدی",
    email: "fateme@example.com",
    phone: "09187654321",
    role: "customer",
    status: "active",
    createdAt: "2024-01-12T09:15:00Z",
    lastLogin: "2024-01-14T16:45:00Z",
    avatar: ""
  },
  {
    id: "3",
    name: "علی رضایی",
    email: "ali@example.com",
    phone: "09365478912",
    role: "customer",
    status: "inactive",
    createdAt: "2024-01-08T11:25:00Z",
    lastLogin: "2024-01-13T12:30:00Z",
    avatar: ""
  },
  {
    id: "4",
    name: "زهرا صادقی",
    email: "zahra@example.com",
    phone: "09123698741",
    role: "moderator",
    status: "active",
    createdAt: "2024-01-11T13:40:00Z",
    lastLogin: "2024-01-15T18:10:00Z",
    avatar: ""
  }
];

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <ShieldCheck className="h-3 w-3 ml-1" />
            مدیر
          </Badge>
        );
      case "moderator":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 ml-1" />
            ناظر
          </Badge>
        );
      case "customer":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            مشتری
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            فعال
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            غیرفعال
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "کاربر حذف شد",
      description: "کاربر با موفقیت از سیستم حذف شد",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">مدیریت کاربران</h2>
            <p className="text-gray-600 mt-2">مدیریت کاربران و دسترسی‌های سیستم</p>
          </div>
          <Button className="bg-persian-blue hover:bg-persian-blue/90">
            <UserPlus className="h-4 w-4 ml-2" />
            افزودن کاربر جدید
          </Button>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">کل کاربران</p>
                  <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">فعال</p>
                  <p className="text-2xl font-bold text-green-900">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">مدیران</p>
                  <p className="text-2xl font-bold text-red-900">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <ShieldX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">مشتریان</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {users.filter(u => u.role === 'customer').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-persian-blue to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              لیست کاربران
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">کاربر</TableHead>
                  <TableHead className="font-semibold">اطلاعات تماس</TableHead>
                  <TableHead className="font-semibold">نقش</TableHead>
                  <TableHead className="font-semibold">وضعیت</TableHead>
                  <TableHead className="font-semibold">تاریخ عضویت</TableHead>
                  <TableHead className="font-semibold">آخرین ورود</TableHead>
                  <TableHead className="font-semibold">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-persian-blue/10 text-persian-blue">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.phone}</div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(user.lastLogin)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
