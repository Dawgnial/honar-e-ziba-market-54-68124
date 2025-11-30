
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Star, Archive, ShoppingCart, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSupabaseAdminProducts } from "../hooks/useSupabaseAdminProducts";
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
import ProductForm from "../components/admin/ProductForm";
import ProductVariantsManager from "../components/admin/ProductVariantsManager";
import AttributeValueManager from "../components/admin/AttributeValueManager";
import ProductDeleteConfirm from "../components/admin/ProductDeleteConfirm";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseCategories } from "../hooks/useSupabaseCategories";
import { ProductPagination } from "../components/ProductPagination";

const AdminProducts = () => {
  const { products, loading, deleteProduct, refetch } = useSupabaseAdminProducts();
  const { categories } = useSupabaseCategories();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const addButtonRef = useRef<HTMLButtonElement>(null);
  
  // Debounce search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const ITEMS_PER_PAGE = 20;
  
  // Filter products based on search term with Persian text normalization
  const normalizeText = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/ی/g, 'ي')
      .replace(/ک/g, 'ك')
      .replace(/ة/g, 'ه')
      .replace(/آ/g, 'ا')
      .trim();
  };

  // Memoized filtered products with debounced search
  const filteredProducts = useMemo(() => {
    console.log('🔍 Admin Products Search:', {
      totalProducts: products.length,
      searchTerm: debouncedSearchTerm,
      hasSearch: !!debouncedSearchTerm.trim()
    });
    
    if (!debouncedSearchTerm.trim()) {
      console.log('✅ No search term - showing all products');
      return products;
    }
    
    const filtered = products.filter(product => {
      try {
        const normalizedSearchTerm = normalizeText(debouncedSearchTerm);
        const normalizedTitle = normalizeText(product.title);
        const normalizedCategory = normalizeText(getCategoryName(product.category_id));
        const normalizedDescription = normalizeText(product.description);
        
        const matches = normalizedTitle.includes(normalizedSearchTerm) ||
               normalizedCategory.includes(normalizedSearchTerm) ||
               normalizedDescription.includes(normalizedSearchTerm);
        
        if (matches) {
          console.log('✓ Match found:', product.title);
        }
        
        return matches;
      } catch (error) {
        console.error('❌ Error filtering product:', error);
        return false;
      }
    });
    
    console.log('📊 Filtered results:', filtered.length);
    return filtered;
  }, [products, debouncedSearchTerm, categories]);
  
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleEdit = (product: any, event: React.MouseEvent) => {
    setEditingProduct(product);
    setTriggerElement(event.currentTarget as HTMLElement);
    setIsFormOpen(true);
  };

  const handleAdd = (event: React.MouseEvent) => {
    setEditingProduct(null);
    setTriggerElement(event.currentTarget as HTMLElement);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setTriggerElement(null);
    refetch();
  };

  const handleDeleteClick = (product: any, event: React.MouseEvent) => {
    setDeletingProduct(product);
    setTriggerElement(event.currentTarget as HTMLElement);
    setIsDeleteOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      setIsDeleting(productId);
      await deleteProduct(productId);
      refetch();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : 'دسته‌بندی نامشخص';
  };

  const toFarsiNumber = (num: number | string): string => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (digit) => farsiDigits[parseInt(digit)]);
  };

  const getAvailabilityStatus = (product: any) => {
    const isManuallyAvailable = product.availability_status === 'available';
    
    if (!isManuallyAvailable) {
      return { text: 'ناموجود', color: 'bg-red-500' };
    }
    
    return { text: 'موجود', color: 'bg-green-500' };
  };

  const featuredCount = filteredProducts.filter(p => p.is_featured).length;

  const getProductMainImage = (product: any): string => {
    if (product.image_url) {
      try {
        const parsed = JSON.parse(product.image_url);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : product.image_url;
      } catch {
        return product.image_url;
      }
    }
    return '/placeholder.svg';
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت محصولات</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">مدیریت و ویرایش محصولات فروشگاه</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {toFarsiNumber(featuredCount)} محصول ویژه
            </Badge>
            <span className="text-sm text-gray-500">(حداکثر {toFarsiNumber(8)})</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            ref={addButtonRef}
            onClick={handleAdd} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            افزودن محصول جدید
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="جستجو در محصولات، نام محصول یا دسته‌بندی..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                console.log('🔤 Search input changed:', value);
                setSearchTerm(value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pr-10 text-right"
            />
            {searchTerm && (
              <div className="mt-2 text-xs text-muted-foreground">
                در حال جستجو برای: "{searchTerm}" | نتایج: {filteredProducts.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-persian-blue to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            لیست محصولات ({toFarsiNumber(filteredProducts.length)})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            searchTerm ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">محصولی یافت نشد</h3>
                <p className="text-gray-500 dark:text-gray-400">برای "{searchTerm}" نتیجه‌ای پیدا نشد</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">هنوز محصولی اضافه نشده</h3>
                <p className="text-gray-500 dark:text-gray-400">اولین محصول خود را اضافه کنید</p>
              </div>
            )
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">تصویر</TableHead>
                    <TableHead className="font-semibold">نام محصول</TableHead>
                    <TableHead className="font-semibold">دسته‌بندی</TableHead>
                    <TableHead className="font-semibold">قیمت</TableHead>
                    
                    <TableHead className="font-semibold">وضعیت</TableHead>
                    <TableHead className="font-semibold">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProducts.map((product) => {
                    const availabilityStatus = getAvailabilityStatus(product);
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <img
                            src={getProductMainImage(product)}
                            alt={product.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {product.title}
                            {product.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getCategoryName(product.category_id)}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          <div className="space-y-1">
                            {product.discount_percentage > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                {toFarsiNumber(product.price?.toLocaleString())} تومان
                              </div>
                            )}
                            <div>
                              {product.discount_percentage > 0 ? (
                                <>
                                  {toFarsiNumber(Math.round((product.price * (1 - product.discount_percentage / 100)))?.toLocaleString())} تومان
                                  <Badge className="mr-1 bg-red-500 text-white text-xs">
                                    {toFarsiNumber(product.discount_percentage)}% تخفیف
                                  </Badge>
                                </>
                              ) : (
                                `${toFarsiNumber(product.price?.toLocaleString())} تومان`
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={`${availabilityStatus.color} text-white`}>
                              {availabilityStatus.text}
                            </Badge>
                            {product.is_featured && (
                              <Badge variant="outline" className="text-yellow-600">
                                ویژه
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ProductVariantsManager 
                              productId={product.id} 
                              productTitle={product.title}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleEdit(product, e)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <ProductDeleteConfirm
                              productId={product.id}
                              productTitle={product.title}
                              onDelete={handleDelete}
                              isDeleting={isDeleting === product.id}
                              triggerElement={triggerElement}
                              isOpen={isDeleteOpen && deletingProduct?.id === product.id}
                              onTriggerClick={(e) => handleDeleteClick(product, e)}
                              onOpenChange={(open) => {
                                setIsDeleteOpen(open);
                                if (!open) {
                                  setDeletingProduct(null);
                                  setTriggerElement(null);
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        onSuccess={handleFormClose}
        onCancel={handleFormClose}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default AdminProducts;
