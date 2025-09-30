import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Save, X } from "lucide-react";
import { useProductVariants, ProductAttributeValue } from "../../hooks/useProductVariants";
import { formatPriceToFarsi, toFarsiNumber } from "../../utils/numberUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AttributeValueManagerProps {
  attributeId: string;
  attributeName: string;
}

const AttributeValueManager = ({ attributeId, attributeName }: AttributeValueManagerProps) => {
  const { attributeValues, refetchAttributeValues } = useProductVariants();
  const [isOpen, setIsOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<ProductAttributeValue | null>(null);
  const [newValue, setNewValue] = useState({
    value: '',
    display_value: '',
    price_modifier: 0
  });
  const [loading, setLoading] = useState(false);

  const attributeValuesList = attributeValues.filter(av => av.attribute_id === attributeId);

  const handleSaveNewValue = async () => {
    if (!newValue.value || !newValue.display_value) {
      toast.error('لطفاً همه فیلدها را پر کنید');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('product_attribute_values')
        .insert({
          attribute_id: attributeId,
          value: newValue.value,
          display_value: newValue.display_value,
          price_modifier: newValue.price_modifier
        });

      if (error) throw error;

      toast.success('مقدار جدید اضافه شد');
      setNewValue({ value: '', display_value: '', price_modifier: 0 });
      refetchAttributeValues();
    } catch (error: any) {
      console.error('Error adding attribute value:', error);
      toast.error('خطا در اضافه کردن مقدار');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValue = async (valueId: string, updates: Partial<ProductAttributeValue>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('product_attribute_values')
        .update(updates)
        .eq('id', valueId);

      if (error) throw error;

      toast.success('مقدار بروزرسانی شد');
      setEditingValue(null);
      refetchAttributeValues();
    } catch (error: any) {
      console.error('Error updating attribute value:', error);
      toast.error('خطا در بروزرسانی مقدار');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteValue = async (valueId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('product_attribute_values')
        .delete()
        .eq('id', valueId);

      if (error) throw error;

      toast.success('مقدار حذف شد');
      refetchAttributeValues();
    } catch (error: any) {
      console.error('Error deleting attribute value:', error);
      toast.error('خطا در حذف مقدار');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 ml-2" />
          مدیریت مقادیر {attributeName}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>مدیریت مقادیر ویژگی: {attributeName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add new value */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-4">افزودن مقدار جدید</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">مقدار (انگلیسی)</Label>
                <Input
                  id="value"
                  value={newValue.value}
                  onChange={(e) => setNewValue(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="مثال: red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_value">نام نمایشی (فارسی)</Label>
                <Input
                  id="display_value"
                  value={newValue.display_value}
                  onChange={(e) => setNewValue(prev => ({ ...prev, display_value: e.target.value }))}
                  placeholder="مثال: قرمز"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_modifier">قیمت اضافی (تومان)</Label>
                <Input
                  id="price_modifier"
                  type="number"
                  value={newValue.price_modifier}
                  onChange={(e) => setNewValue(prev => ({ ...prev, price_modifier: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveNewValue} 
              disabled={loading || !newValue.value || !newValue.display_value}
              className="mt-4"
            >
              <Plus className="h-4 w-4 ml-2" />
              افزودن مقدار
            </Button>
          </div>

          {/* Existing values */}
          <div className="space-y-3">
            <h3 className="font-semibold">مقادیر موجود</h3>
            {attributeValuesList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                هنوز مقداری تعریف نشده است
              </div>
            ) : (
              <div className="space-y-2">
                {attributeValuesList.map((value) => (
                  <div key={value.id} className="border rounded-lg p-3">
                    {editingValue?.id === value.id ? (
                      <EditValueForm
                        value={editingValue}
                        onSave={(updates) => handleUpdateValue(value.id, updates)}
                        onCancel={() => setEditingValue(null)}
                        loading={loading}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="font-medium">{value.display_value}</span>
                            <span className="text-sm text-gray-500 mr-2">({value.value})</span>
                          </div>
                          <Badge variant="outline">
                            {value.price_modifier === 0 
                              ? 'بدون تغییر قیمت'
                              : value.price_modifier > 0 
                              ? `+${formatPriceToFarsi(value.price_modifier)} تومان`
                              : `${formatPriceToFarsi(value.price_modifier)} تومان`
                            }
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingValue(value)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteValue(value.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditValueFormProps {
  value: ProductAttributeValue;
  onSave: (updates: Partial<ProductAttributeValue>) => void;
  onCancel: () => void;
  loading: boolean;
}

const EditValueForm = ({ value, onSave, onCancel, loading }: EditValueFormProps) => {
  const [formData, setFormData] = useState({
    value: value.value,
    display_value: value.display_value,
    price_modifier: value.price_modifier
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          value={formData.value}
          onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
          placeholder="مقدار (انگلیسی)"
        />
        <Input
          value={formData.display_value}
          onChange={(e) => setFormData(prev => ({ ...prev, display_value: e.target.value }))}
          placeholder="نام نمایشی (فارسی)"
        />
        <Input
          type="number"
          value={formData.price_modifier}
          onChange={(e) => setFormData(prev => ({ ...prev, price_modifier: Number(e.target.value) }))}
          placeholder="قیمت اضافی (تومان)"
        />
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleSave} 
          disabled={loading || !formData.value || !formData.display_value}
          size="sm"
        >
          <Save className="h-4 w-4 ml-2" />
          ذخیره
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm">
          انصراف
        </Button>
      </div>
    </div>
  );
};

export default AttributeValueManager;
