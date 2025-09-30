import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProductVariants, ProductAttributeValue } from '@/hooks/useProductVariants';
import { formatPriceToFarsi, toFarsiNumber } from '@/utils/numberUtils';

interface ProductAttributeSelectorProps {
  productId: string;
  basePrice: number;
  onAttributeChange: (selectedAttributes: Record<string, ProductAttributeValue>, totalPrice: number) => void;
}

const ProductAttributeSelector = ({ productId, basePrice, onAttributeChange }: ProductAttributeSelectorProps) => {
  const {
    variants,
    loading,
    fetchProductVariants
  } = useProductVariants();

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, ProductAttributeValue>>({});
  const [productAttributes, setProductAttributes] = useState<any[]>([]);
  const [productAttributeValues, setProductAttributeValues] = useState<any[]>([]);

  useEffect(() => {
    fetchProductVariants(productId);
  }, [productId]);

  useEffect(() => {
    // Extract unique attributes and their values from product variants
    if (variants.length > 0) {
      const attributesMap = new Map();
      const valuesMap = new Map();

      variants.forEach(variant => {
        if (variant.attributes) {
          variant.attributes.forEach(attr => {
            // Add attribute to map if not exists
            if (!attributesMap.has(attr.attribute_id)) {
              attributesMap.set(attr.attribute_id, {
                id: attr.attribute_id,
                name: attr.attribute_name,
                display_name: attr.attribute_display_name,
                is_required: true // Assume required since it's defined for this product
              });
            }

            // Add attribute value to map if not exists
            if (!valuesMap.has(attr.attribute_value_id)) {
              valuesMap.set(attr.attribute_value_id, {
                id: attr.attribute_value_id,
                attribute_id: attr.attribute_id,
                value: attr.value,
                display_value: attr.display_value,
                price_modifier: 0 // Will be calculated from variant prices
              });
            }
          });
        }
      });

      setProductAttributes(Array.from(attributesMap.values()));
      setProductAttributeValues(Array.from(valuesMap.values()));
    } else {
      setProductAttributes([]);
      setProductAttributeValues([]);
    }
  }, [variants]);

  useEffect(() => {
    // Calculate total price including attribute modifiers
    const totalModifier = Object.values(selectedAttributes).reduce((sum, attr) => sum + (attr.price_modifier || 0), 0);
    const totalPrice = basePrice + totalModifier;
    onAttributeChange(selectedAttributes, totalPrice);
  }, [selectedAttributes, basePrice, onAttributeChange]);

  const handleAttributeSelect = (attributeId: string, attributeValue: ProductAttributeValue) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: attributeValue
    }));
  };

  const getAttributeValuesByAttributeId = (attributeId: string) => {
    return productAttributeValues.filter(value => value.attribute_id === attributeId);
  };

  const formatPrice = (price: number) => {
    return formatPriceToFarsi(price) + ' تومان';
  };

  const formatPriceModifier = (modifier: number) => {
    if (modifier === 0) return '';
    return modifier > 0 ? `(+${formatPriceToFarsi(modifier)})` : `(${formatPriceToFarsi(modifier)})`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">در حال بارگذاری ویژگی‌ها...</div>
        </CardContent>
      </Card>
    );
  }

  if (productAttributes.length === 0) {
    return null;
  }

  const totalModifier = Object.values(selectedAttributes).reduce((sum, attr) => sum + (attr.price_modifier || 0), 0);
  const totalPrice = basePrice + totalModifier;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">انتخاب ویژگی‌های محصول</h3>
        
        {productAttributes.map((attribute) => {
          const availableValues = getAttributeValuesByAttributeId(attribute.id);
          
          if (availableValues.length === 0) return null;
          
          return (
            <div key={attribute.id} className="space-y-2">
              <label className="font-medium text-sm">
                {attribute.display_name}
                {attribute.is_required && <span className="text-red-500 mr-1">*</span>}
              </label>
              
              <div className="flex flex-wrap gap-2">
                {availableValues.map((value) => {
                  const isSelected = selectedAttributes[attribute.id]?.id === value.id;
                  
                  return (
                    <Button
                      key={value.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAttributeSelect(attribute.id, value)}
                      className={`${
                        isSelected 
                          ? 'bg-persian-blue hover:bg-persian-blue/90' 
                          : ''
                      } flex flex-col items-center h-auto py-2 px-3`}
                    >
                      <span>{value.display_value}</span>
                      {value.price_modifier !== 0 && (
                        <span className="text-xs opacity-80">
                          {formatPriceModifier(value.price_modifier)}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Show total price */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">قیمت نهایی:</div>
              <div className="text-lg font-bold text-green-primary">
                {formatPrice(totalPrice)}
              </div>
            </div>
            
            {totalModifier !== 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">قیمت پایه:</div>
                <div className="text-sm font-medium">
                  {formatPrice(basePrice)}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  اضافه شده: {formatPrice(totalModifier)}
                </div>
              </div>
            )}
          </div>

          {Object.keys(selectedAttributes).length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">ویژگی‌های انتخابی:</div>
              <div className="flex flex-wrap gap-1">
                {Object.values(selectedAttributes).map((attr, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {productAttributes.find(a => a.id === attr.attribute_id)?.display_name}: {attr.display_value}
                    {attr.price_modifier !== 0 && (
                      <span className="mr-1">{formatPriceModifier(attr.price_modifier)}</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Show required attributes that haven't been selected */}
        {productAttributes.some(attr => attr.is_required && !selectedAttributes[attr.id]) && (
          <div className="text-sm text-orange-600 dark:text-orange-400">
            لطفاً همه ویژگی‌های ضروری را انتخاب کنید
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAttributeSelector;