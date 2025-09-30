import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSupabaseCategories } from "../../hooks/useSupabaseCategories";
import { useToast } from "@/hooks/use-toast";
import CategoryImageUpload from "./CategoryImageUpload";
import { Package, Edit, Plus, TrendingUp } from "lucide-react";
import { useSupabaseProducts } from "../../hooks/useSupabaseProducts";
import { toFarsiNumber } from "../../utils/numberUtils";

interface CategoryFormProps {
  category?: any;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen?: boolean;
  triggerElement?: HTMLElement | null;
}

const CategoryForm = ({ category, onSuccess, onCancel, isOpen = false }: CategoryFormProps) => {
  const { toast } = useToast();
  const { createCategory, updateCategory } = useSupabaseCategories();
  const { bulkUpdatePrices } = useSupabaseProducts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: null as string | null,
  });
  const [priceIncrease, setPriceIncrease] = useState("");
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (isOpen && category) {
      setFormData({
        title: category.title || "",
        imageUrl: category.image_url || null,
      });
    } else if (isOpen && !category) {
      setFormData({
        title: "",
        imageUrl: null,
      });
    }
    setPriceIncrease("");
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await updateCategory(category.id, formData.title, formData.imageUrl);
        toast({
          title: "دسته‌بندی با موفقیت به‌روزرسانی شد",
        });
      } else {
        await createCategory(formData.title, formData.imageUrl);
        toast({
          title: "دسته‌بندی با موفقیت اضافه شد",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: "خطا در انجام عملیات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
  };

  const handleBulkPriceUpdate = async () => {
    if (!category?.id || !priceIncrease || parseFloat(priceIncrease) <= 0) {
      toast({
        title: "خطا",
        description: "لطفاً مقدار افزایش قیمت معتبر وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPrices(true);
    try {
      const increaseAmount = parseFloat(priceIncrease);
      await bulkUpdatePrices(category.id, increaseAmount);
      
      toast({
        title: "قیمت‌ها با موفقیت به‌روزرسانی شد",
        description: `${toFarsiNumber(increaseAmount.toLocaleString())} تومان به قیمت تمام محصولات این دسته‌بندی اضافه شد`,
      });
      
      setPriceIncrease("");
    } catch (error) {
      console.error('Error updating prices:', error);
      toast({
        title: "خطا در به‌روزرسانی قیمت‌ها",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {category ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            {category ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </DialogTitle>
        </DialogHeader>
        
        {/* Content */}
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان دسته‌بندی</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                placeholder="عنوان دسته‌بندی را وارد کنید"
                className="text-right"
                dir="rtl"
              />
            </div>

            <CategoryImageUpload
              currentImageUrl={formData.imageUrl}
              onImageChange={handleImageChange}
            />

            {/* Bulk Price Update Section - Only show when editing existing category */}
            {category && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="font-semibold">افزایش گروهی قیمت محصولات</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  این عملیات قیمت تمام محصولات این دسته‌بندی را به مقدار وارد شده افزایش می‌دهد
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={priceIncrease}
                    onChange={(e) => setPriceIncrease(e.target.value)}
                    placeholder="مقدار افزایش قیمت (تومان)"
                    min="0"
                    className="bg-white dark:bg-gray-800 text-right"
                    dir="rtl"
                  />
                  <Button
                    type="button"
                    onClick={handleBulkPriceUpdate}
                    disabled={isUpdatingPrices || !priceIncrease}
                    variant="outline"
                    className="shrink-0 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900 border-amber-300 dark:border-amber-700"
                  >
                    {isUpdatingPrices ? (
                      <>
                        <Package className="h-4 w-4 ml-1 animate-spin" />
                        در حال به‌روزرسانی...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 ml-1" />
                        اعمال افزایش
                      </>
                    )}
                  </Button>
                </div>
                {priceIncrease && parseFloat(priceIncrease) > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {toFarsiNumber(parseFloat(priceIncrease).toLocaleString())} تومان به قیمت تمام محصولات اضافه خواهد شد
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="bg-persian-blue hover:bg-persian-blue/90 flex-1">
                {loading ? "در حال انجام..." : (category ? "به‌روزرسانی" : "افزودن")}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                انصراف
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
