
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Settings } from "lucide-react";
import { useProductVariants } from "../../hooks/useProductVariants";
import { formatPriceToFarsi, toFarsiNumber } from "../../utils/numberUtils";
interface ProductVariantsManagerProps {
  productId: string;
  productTitle: string;
}

const ProductVariantsManager = ({ productId, productTitle }: ProductVariantsManagerProps) => {
  const {
    attributes,
    attributeValues,
    variants,
    loading,
    fetchProductVariants,
    createProductVariant,
    deleteProductVariant,
    refetchAttributes,
    refetchAttributeValues
  } = useProductVariants();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false);
  
  const [newVariant, setNewVariant] = useState({
    price: '',
    stock_quantity: '',
    sku: '',
    selectedAttributes: {} as Record<string, string>
  });

  useEffect(() => {
    if (isOpen) {
      fetchProductVariants(productId);
      refetchAttributes();
      refetchAttributeValues();
    }
  }, [isOpen, productId]);

  const handleAddVariant = async () => {
    if (!newVariant.price || Object.keys(newVariant.selectedAttributes).length === 0) {
      return;
    }

    const attributesArray = Object.entries(newVariant.selectedAttributes).map(([attributeId, valueId]) => ({
      attribute_id: attributeId,
      attribute_value_id: valueId
    }));

    await createProductVariant({
      product_id: productId,
      price: Number(newVariant.price),
      stock_quantity: Number(newVariant.stock_quantity) || 0,
      sku: newVariant.sku || undefined,
      attributes: attributesArray
    });

    // Reset form
    setNewVariant({
      price: '',
      stock_quantity: '',
      sku: '',
      selectedAttributes: {}
    });
    setIsAddVariantOpen(false);
  };

  const getAttributeValuesByAttributeId = (attributeId: string) => {
    return attributeValues.filter(value => value.attribute_id === attributeId);
  };

const formatPrice = (price: number) => {
  return formatPriceToFarsi(price) + ' تومان';
};

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 ml-2" />
          مدیریت ویژگی‌ها
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[800px] max-h-[600px] overflow-y-auto p-6" align="start">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">مدیریت ویژگی‌های محصول: {productTitle}</h3>

          <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">ویژگی‌های محصول</h3>
            <Dialog open={isAddVariantOpen} onOpenChange={setIsAddVariantOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  افزودن ویژگی جدید
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>افزودن ویژگی جدید</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">قیمت (تومان)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newVariant.price}
                        onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="قیمت را وارد کنید"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">موجودی</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newVariant.stock_quantity}
                        onChange={(e) => setNewVariant(prev => ({ ...prev, stock_quantity: e.target.value }))}
                        placeholder="تعداد موجودی"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sku">کد محصول (اختیاری)</Label>
                    <Input
                      id="sku"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                      placeholder="کد یکتای محصول"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>ویژگی‌ها</Label>
                    {attributes.map((attribute) => (
                      <div key={attribute.id} className="space-y-2">
                        <Label>{attribute.display_name}</Label>
                        <Select
                          value={newVariant.selectedAttributes[attribute.id] || ''}
                          onValueChange={(value) => 
                            setNewVariant(prev => ({
                              ...prev,
                              selectedAttributes: {
                                ...prev.selectedAttributes,
                                [attribute.id]: value
                              }
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`انتخاب ${attribute.display_name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getAttributeValuesByAttributeId(attribute.id).map((value) => (
                              <SelectItem key={value.id} value={value.id}>
                                {value.display_value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddVariant} disabled={loading}>
                      {loading ? "در حال افزودن..." : "افزودن ویژگی"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddVariantOpen(false)}>
                      انصراف
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">در حال بارگذاری...</div>
          ) : variants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              هنوز ویژگی‌ای برای این محصول تعریف نشده است
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ویژگی‌ها</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>موجودی</TableHead>
                  <TableHead>کد محصول</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {variant.attributes?.map((attr, index) => (
                          <Badge key={index} variant="secondary">
                            {attr.attribute_display_name}: {attr.display_value}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(variant.price)}
                    </TableCell>
                    <TableCell>{toFarsiNumber(variant.stock_quantity)}</TableCell>
                    <TableCell>{variant.sku || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={variant.is_active ? "default" : "secondary"}>
                        {variant.is_active ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProductVariant(variant.id, productId)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductVariantsManager;
