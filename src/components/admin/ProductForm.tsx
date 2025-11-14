import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";
import { useSupabaseAdminProducts } from "../../hooks/useSupabaseAdminProducts";
import { useSupabaseCategories } from "../../hooks/useSupabaseCategories";
import { useToast } from "@/hooks/use-toast";
import ProductImageUpload from "./ProductImageUpload";
import ProductAttributesManager from "./ProductAttributesManager";
import { Star, Package, Tag, DollarSign, FileText, Image, Archive, Percent, ShoppingCart } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen?: boolean;
}

const ProductForm = ({ product, onSuccess, onCancel, isOpen = true }: ProductFormProps) => {
  const { toast } = useToast();
  const { categories } = useSupabaseCategories();
  const { createProduct, updateProduct } = useSupabaseAdminProducts();
  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Helper function to parse image URLs properly
  const parseImageUrls = (product: any) => {
    if (!product) return [];
    
    try {
      if (product.image_url) {
        // Try to parse as JSON array first
        try {
          const parsed = JSON.parse(product.image_url);
          return Array.isArray(parsed) ? parsed : [product.image_url];
        } catch {
          // If not JSON, treat as single URL
          return [product.image_url];
        }
      }
    } catch (error) {
      console.error('Error parsing image URLs:', error);
    }
    
    return [];
  };

  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    stock: product?.stock || "",
    imageUrls: parseImageUrls(product),
    categoryId: product?.category_id || "",
    isFeatured: product?.is_featured || false,
    discountPercentage: product?.discount_percentage || 0,
    availabilityStatus: product?.availability_status || "available",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        imageUrls: parseImageUrls(product),
        categoryId: product.category_id || "",
        isFeatured: product.is_featured || false,
        discountPercentage: product.discount_percentage || 0,
        availabilityStatus: product.availability_status || "available",
      });
    }
  }, [product]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrls[0] || "",
        imageUrls: JSON.stringify(formData.imageUrls),
        categoryId: formData.categoryId,
        isFeatured: formData.isFeatured,
        discountPercentage: Number(formData.discountPercentage),
        availabilityStatus: formData.availabilityStatus,
      };

      if (product) {
        await updateProduct(product.id, submitData);
        toast({
          title: "محصول با موفقیت به‌روزرسانی شد",
        });
      } else {
        await createProduct(submitData);
        toast({
          title: "محصول با موفقیت اضافه شد",
        });
      }
      onSuccess();
    } catch (error) {
      // Error already handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImagesChange = (imageUrls: string[]) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: imageUrls
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] 
          w-[95vw] max-w-4xl max-h-[85vh] overflow-hidden bg-white dark:bg-gray-900 
          rounded-2xl shadow-2xl border-0 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {product ? <Package className="h-5 w-5" /> : <Star className="h-5 w-5" />}
            </div>
            {product ? "ویرایش محصول" : "افزودن محصول جدید"}
          </h2>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(85vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-white">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Image className="h-4 w-4 text-white" />
                  </div>
                  تصاویر محصول
                  <Badge variant="secondary" className="mr-auto">
                    {formData.imageUrls.length}/5
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductImageUpload
                  currentImages={formData.imageUrls}
                  onImagesChange={handleImagesChange}
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-white">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  اطلاعات پایه محصول
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    نام محصول *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    placeholder="نام زیبا و جذاب برای محصول خود وارد کنید"
                    className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    توضیحات محصول
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={5}
                    placeholder="توضیحات کامل و جذاب درباره محصول، ویژگی‌ها و مزایای آن را بنویسید... (اختیاری)"
                    className="text-base border-2 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price, Stock and Category */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-white">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  قیمت، موجودی و دسته‌بندی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-base font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      قیمت (تومان) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="discountPercentage" className="text-base font-medium flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      تخفیف (درصد)
                    </Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => handleChange("discountPercentage", e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      تخفیف روی قیمت محصول اعمال می‌شود و در صفحه محصولات نمایش داده خواهد شد
                    </p>
                  </div>


                  <div className="space-y-3">
                    <Label htmlFor="categoryId" className="text-base font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      دسته‌بندی *
                    </Label>
                    <Select value={String(formData.categoryId)} onValueChange={(value) => handleChange("categoryId", value)}>
                      <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="انتخاب دسته‌بندی مناسب" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Attributes */}
            {product && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-white">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    مدیریت ویژگی‌های محصول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductAttributesManager productId={product.id} />
                </CardContent>
              </Card>
            )}

            {/* Availability and Special Settings */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800 dark:text-white">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  تنظیمات ویژه و موجودی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="availabilityStatus" className="text-base font-medium flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      وضعیت دستی موجودی
                    </Label>
                    <Select value={formData.availabilityStatus} onValueChange={(value) => handleChange("availabilityStatus", value)}>
                      <SelectTrigger className="h-12 text-base border-2 focus:border-blue-500 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">موجود</SelectItem>
                        <SelectItem value="unavailable">ناموجود</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      حتی اگر موجودی عددی دارید، می‌توانید محصول را دستی روی "ناموجود" قرار دهید
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-orange-200 dark:border-gray-700">
                    <Checkbox
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleChange("isFeatured", checked)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="isFeatured" className="text-base font-medium cursor-pointer flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        محصول ویژه
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        محصولات ویژه در صفحه اصلی نمایش داده می‌شوند (حداکثر 8 محصول)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-100 dark:border-gray-800">
              <Button 
                type="submit" 
                disabled={loading || !formData.title || !formData.price} 
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال پردازش...
                  </div>
                ) : (
                  product ? "به‌روزرسانی محصول" : "افزودن محصول"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="h-12 px-8 border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
              >
                انصراف
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;
