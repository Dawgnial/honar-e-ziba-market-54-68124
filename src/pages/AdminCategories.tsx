
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Image, Package, Search, GripVertical } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSupabaseCategories } from "../hooks/useSupabaseCategories";
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
import CategoryForm from "../components/admin/CategoryForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProductPagination } from "../components/ProductPagination";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCategoryRowProps {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (categoryId: string) => void;
  isDeleting: boolean;
}

const SortableCategoryRow = ({ category, onEdit, onDelete, isDeleting }: SortableCategoryRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      </TableCell>
      <TableCell>
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.title}
            className="w-12 h-12 rounded object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
            <Image className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{category.title}</TableCell>
      <TableCell>{new Date(category.created_at).toLocaleDateString('fa-IR')}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                disabled={isDeleting}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>تأیید حذف</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا از حذف دسته‌بندی "{category.title}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(category.id)}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? "در حال حذف..." : "حذف"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

const AdminCategories = () => {
  const { categories, loading, deleteCategory, updateCategoryOrder, refetch } = useSupabaseCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce search for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const ITEMS_PER_PAGE = 20;
  
  // Filter categories based on search term with Persian text normalization
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

  // Memoized filtered categories with debounced search
  const filteredCategories = useMemo(() => {
    console.log('🔍 Admin Categories Search:', {
      totalCategories: categories.length,
      searchTerm: debouncedSearchTerm,
      hasSearch: !!debouncedSearchTerm.trim()
    });
    
    if (!debouncedSearchTerm.trim()) {
      console.log('✅ No search term - showing all categories');
      return categories;
    }
    
    const filtered = categories.filter(category => {
      try {
        const normalizedSearchTerm = normalizeText(debouncedSearchTerm);
        const normalizedTitle = normalizeText(category.title);
        
        const matches = normalizedTitle.includes(normalizedSearchTerm);
        
        if (matches) {
          console.log('✓ Match found:', category.title);
        }
        
        return matches;
      } catch (error) {
        console.error('❌ Error filtering category:', error);
        return false;
      }
    });
    
    console.log('📊 Filtered results:', filtered.length);
    return filtered;
  }, [categories, debouncedSearchTerm]);
  
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const toFarsiNumber = (num: number | string): string => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (digit) => farsiDigits[parseInt(digit)]);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    refetch();
  };

  const handleDelete = async (categoryId: string) => {
    try {
      setIsDeleting(categoryId);
      await deleteCategory(categoryId);
      refetch();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentCategories.findIndex((cat) => cat.id === active.id);
      const newIndex = currentCategories.findIndex((cat) => cat.id === over.id);

      const reorderedCategories = arrayMove(currentCategories, oldIndex, newIndex);

      // Update display_order for all affected categories
      try {
        for (let i = 0; i < reorderedCategories.length; i++) {
          const category = reorderedCategories[i];
          const newOrder = startIndex + i;
          await updateCategoryOrder(category.id, newOrder);
        }
      } catch (error) {
        console.error('Error updating category order:', error);
      }
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">مدیریت و ویرایش دسته‌بندی‌های محصولات - برای تغییر ترتیب، دسته‌بندی‌ها را بکشید</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {toFarsiNumber(categories.length)} دسته‌بندی
            </Badge>
          </div>
        </div>
        <Button 
          onClick={handleAdd} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          افزودن دسته‌بندی جدید
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="جستجو در دسته‌بندی‌ها..."
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
                در حال جستجو برای: "{searchTerm}" | نتایج: {filteredCategories.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-persian-blue to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            لیست دسته‌بندی‌ها ({toFarsiNumber(filteredCategories.length)})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCategories.length === 0 ? (
            searchTerm ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">دسته‌بندی‌ای یافت نشد</h3>
                <p className="text-gray-500 dark:text-gray-400">برای "{searchTerm}" نتیجه‌ای پیدا نشد</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">هنوز دسته‌بندی‌ای اضافه نشده</h3>
                <p className="text-gray-500 dark:text-gray-400">اولین دسته‌بندی خود را اضافه کنید</p>
              </div>
            )
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="font-semibold w-16"></TableHead>
                      <TableHead className="font-semibold">تصویر</TableHead>
                      <TableHead className="font-semibold">نام دسته‌بندی</TableHead>
                      <TableHead className="font-semibold">تاریخ ایجاد</TableHead>
                      <TableHead className="font-semibold">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={currentCategories.map(cat => cat.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {currentCategories.map((category) => (
                        <SortableCategoryRow
                          key={category.id}
                          category={category}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isDeleting={isDeleting === category.id}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
              
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

      {/* Category Form Dialog */}
      <CategoryForm
        category={editingCategory}
        onSuccess={handleFormClose}
        onCancel={handleFormClose}
        isOpen={isFormOpen}
      />
    </div>
  );
};

export default AdminCategories;
