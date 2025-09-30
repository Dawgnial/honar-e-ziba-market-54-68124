import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProductVariants, ProductVariant } from '@/hooks/useProductVariants';
import { formatPriceToFarsi, toFarsiNumber } from '@/utils/numberUtils';

interface ProductVariantSelectorProps {
  productId: string;
  basePrice: number;
  onVariantSelect: (variant: ProductVariant | null, price: number) => void;
}

const ProductVariantSelector = ({ productId, basePrice, onVariantSelect }: ProductVariantSelectorProps) => {
  const {
    variants,
    loading,
    fetchProductVariants
  } = useProductVariants();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
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
                is_required: true
              });
            }

            // Add attribute value to map if not exists
            if (!valuesMap.has(attr.attribute_value_id)) {
              valuesMap.set(attr.attribute_value_id, {
                id: attr.attribute_value_id,
                attribute_id: attr.attribute_id,
                value: attr.value,
                display_value: attr.display_value
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
    // Find matching variant based on selected attributes
    const matchingVariant = variants.find(variant => {
      if (!variant.attributes) return false;
      
      const variantAttributeMap = variant.attributes.reduce((acc, attr) => {
        acc[attr.attribute_id] = attr.attribute_value_id;
        return acc;
      }, {} as Record<string, string>);

      // Check if all selected attributes match this variant
      return Object.keys(selectedAttributes).every(attrId => 
        variantAttributeMap[attrId] === selectedAttributes[attrId]
      ) && Object.keys(variantAttributeMap).length === Object.keys(selectedAttributes).length;
    });

    setSelectedVariant(matchingVariant || null);
    onVariantSelect(matchingVariant, matchingVariant ? matchingVariant.price : basePrice);
  }, [selectedAttributes, variants, basePrice, onVariantSelect]);

  const handleAttributeSelect = (attributeId: string, valueId: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeId]: valueId
    }));
  };

  const getAttributeValuesByAttributeId = (attributeId: string) => {
    return productAttributeValues.filter(value => value.attribute_id === attributeId);
  };

  const isAttributeValueAvailable = (attributeId: string, valueId: string) => {
    // Check if there's any variant with this attribute value combination
    const otherSelectedAttrs = { ...selectedAttributes };
    delete otherSelectedAttrs[attributeId];
    otherSelectedAttrs[attributeId] = valueId;

    return variants.some(variant => {
      if (!variant.attributes || !variant.is_active) return false;
      
      const variantAttributeMap = variant.attributes.reduce((acc, attr) => {
        acc[attr.attribute_id] = attr.attribute_value_id;
        return acc;
      }, {} as Record<string, string>);

      return Object.keys(otherSelectedAttrs).every(attrId => 
        variantAttributeMap[attrId] === otherSelectedAttrs[attrId]
      );
    });
  };

  const formatPrice = (price: number) => {
    return formatPriceToFarsi(price) + ' تومان';
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

  if (variants.length === 0) {
    return null; // Don't show anything if no variants exist
  }

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
                  const isSelected = selectedAttributes[attribute.id] === value.id;
                  const isAvailable = isAttributeValueAvailable(attribute.id, value.id);
                  
                  return (
                    <Button
                      key={value.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={!isAvailable}
                      onClick={() => handleAttributeSelect(attribute.id, value.id)}
                      className={`${
                        isSelected 
                          ? 'bg-persian-blue hover:bg-persian-blue/90' 
                          : ''
                      } ${
                        !isAvailable 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                    >
                      {value.display_value}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {selectedVariant && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">قیمت انتخاب شده:</div>
                <div className="text-lg font-bold text-green-primary">
                  {formatPrice(selectedVariant.price)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">موجودی:</div>
                <Badge variant={selectedVariant.stock_quantity > 0 ? "default" : "destructive"}>
                  {selectedVariant.stock_quantity > 0 
                    ? `${toFarsiNumber(selectedVariant.stock_quantity)} عدد`
                    : 'ناموجود'
                  }
                </Badge>
              </div>
            </div>
            
            {selectedVariant.sku && (
              <div className="mt-2 text-xs text-gray-500">
                کد محصول: {selectedVariant.sku}
              </div>
            )}
          </div>
        )}

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

export default ProductVariantSelector;