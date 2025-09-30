import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Settings, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProductCustomAttributes } from "../../hooks/useProductCustomAttributes";
import { formatPriceToFarsi } from "../../utils/numberUtils";

interface ProductAttributesManagerProps {
  productId: string;
}

const ProductAttributesManager = ({ productId }: ProductAttributesManagerProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState<string | null>(null);
  const [newOption, setNewOption] = useState({
    displayValue: '',
    priceModifier: ''
  });
  
  const {
    attributes,
    loading,
    fetchProductCustomAttributes,
    createProductCustomAttribute,
    deleteProductCustomAttribute,
    createAttributeOption,
    deleteAttributeOption
  } = useProductCustomAttributes();

  useEffect(() => {
    if (isOpen && productId) {
      fetchProductCustomAttributes(productId);
    }
  }, [isOpen, productId]);

  const handleAddAttribute = async () => {
    if (!newAttributeName.trim()) {
      toast({
        title: "خطا",
        description: "لطفا نام ویژگی را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingAttribute(true);
      await createProductCustomAttribute(productId, newAttributeName);
      setNewAttributeName('');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsAddingAttribute(false);
    }
  };

  const handleDeleteAttribute = async (attributeId: string) => {
    try {
      await deleteProductCustomAttribute(attributeId, productId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAddOption = async () => {
    if (!selectedAttributeId || !newOption.displayValue.trim()) {
      toast({
        title: "خطا",
        description: "لطفا نام آپشن را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    try {
      await createAttributeOption(
        selectedAttributeId, 
        newOption.displayValue, 
        Number(newOption.priceModifier) || 0, 
        productId
      );
      setNewOption({ displayValue: '', priceModifier: '' });
      setSelectedAttributeId(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      await deleteAttributeOption(optionId, productId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const formatPrice = (price: number): string => {
    return formatPriceToFarsi(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 border-purple-200"
        >
          <Settings className="h-4 w-4" />
          مدیریت ویژگی‌های اختصاصی
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto z-[150]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-purple-600" />
            مدیریت ویژگی‌های اختصاصی محصول
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Add New Attribute */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-4 w-4" />
                افزودن ویژگی جدید
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>نام ویژگی</Label>
                  <Input
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    placeholder="مثال: رنگ، سایز، جنس"
                  />
                </div>
                <Button 
                  onClick={handleAddAttribute} 
                  className="w-full"
                  disabled={isAddingAttribute}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingAttribute ? 'در حال افزودن...' : 'افزودن ویژگی'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* List Existing Attributes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ویژگی‌های تعریف شده</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">در حال بارگذاری...</div>
              ) : attributes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  هیچ ویژگی‌ای تعریف نشده است<br/>
                  <span className="text-sm">برای افزودن ویژگی از فرم بالا استفاده کنید</span>
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {attributes.map((attribute) => (
                    <AccordionItem key={attribute.id} value={attribute.id} className="border rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-base">{attribute.name}</span>
                            <span className="text-sm text-gray-500">
                              ({attribute.options?.length || 0} آپشن)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAttribute(attribute.id);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          {/* Add New Option */}
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-sm">افزودن آپشن جدید</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">نام آپشن</Label>
                                <Input
                                  value={selectedAttributeId === attribute.id ? newOption.displayValue : ''}
                                  onChange={(e) => {
                                    setSelectedAttributeId(attribute.id);
                                    setNewOption(prev => ({ ...prev, displayValue: e.target.value }));
                                  }}
                                  placeholder="مثال: قرمز، کوچک"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">تغییر قیمت (تومان)</Label>
                                <Input
                                  type="number"
                                  value={selectedAttributeId === attribute.id ? newOption.priceModifier : ''}
                                  onChange={(e) => {
                                    setSelectedAttributeId(attribute.id);
                                    setNewOption(prev => ({ ...prev, priceModifier: e.target.value }));
                                  }}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <Button 
                              onClick={handleAddOption}
                              disabled={selectedAttributeId !== attribute.id || !newOption.displayValue.trim()}
                              className="w-full"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              افزودن آپشن
                            </Button>
                          </div>

                          {/* List Options */}
                          <div className="space-y-2">
                            {attribute.options && attribute.options.length > 0 ? (
                              attribute.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{option.display_value}</span>
                                    <span className={`text-sm font-medium ${
                                      option.price_modifier >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {option.price_modifier > 0 && '+'}
                                      {formatPrice(option.price_modifier)} تومان
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    onClick={() => handleDeleteOption(option.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm text-center py-4">
                                هنوز آپشنی تعریف نشده است
                              </p>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAttributesManager;