import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useProductCustomAttributes, ProductCustomAttribute } from '@/hooks/useProductCustomAttributes';
import { formatPriceToFarsi } from '@/utils/numberUtils';

interface ProductCustomAttributeSelectorProps {
  productId: string;
  basePrice: number;
  onAttributeSelect: (selectedOptions: SelectedOption[], totalPriceModifier: number) => void;
}

export interface SelectedOption {
  attributeId: string;
  attributeName: string;
  optionId: string;
  optionValue: string;
  priceModifier: number;
}

const ProductCustomAttributeSelector = ({ 
  productId, 
  basePrice, 
  onAttributeSelect 
}: ProductCustomAttributeSelectorProps) => {
  const {
    attributes,
    loading,
    fetchProductCustomAttributes
  } = useProductCustomAttributes();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, SelectedOption>>({});

  useEffect(() => {
    if (productId) {
      fetchProductCustomAttributes(productId);
    }
  }, [productId]);

  useEffect(() => {
    const optionsArray = Object.values(selectedOptions);
    const totalPrice = optionsArray.reduce((sum, option) => sum + option.priceModifier, 0);
    // Send the total price of selected options, not as modifier to base price
    onAttributeSelect(optionsArray, totalPrice);
  }, [selectedOptions, onAttributeSelect]);

  const handleOptionSelect = (attribute: ProductCustomAttribute, optionId: string) => {
    const option = attribute.options?.find(opt => opt.id === optionId);
    if (!option) return;

    setSelectedOptions(prev => {
      // If the same option is clicked again, deselect it
      if (prev[attribute.id]?.optionId === optionId) {
        const newState = { ...prev };
        delete newState[attribute.id];
        return newState;
      }

      // Otherwise, select the new option
      return {
        ...prev,
        [attribute.id]: {
          attributeId: attribute.id,
          attributeName: attribute.name,
          optionId: option.id,
          optionValue: option.display_value,
          priceModifier: option.price_modifier
        }
      };
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

  if (attributes.length === 0) {
    return null; // Don't show anything if no custom attributes exist
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">انتخاب ویژگی‌های محصول</h3>
        
        {attributes.map((attribute) => {
          if (!attribute.options || attribute.options.length === 0) return null;
          
          return (
            <div key={attribute.id} className="space-y-2">
              <label className="font-medium text-sm">
                {attribute.name}
              </label>
              
              <div className="flex flex-wrap gap-2">
                {attribute.options.map((option) => {
                  const isSelected = selectedOptions[attribute.id]?.optionId === option.id;
                  
                  return (
                    <Button
                      key={option.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleOptionSelect(attribute, option.id)}
                      className={`flex flex-col h-auto py-2 px-3 ${
                        isSelected 
                          ? 'bg-persian-blue hover:bg-persian-blue/90' 
                          : ''
                      }`}
                    >
                      <span>{option.display_value}</span>
                       {option.price_modifier !== 0 && (
                        <span className="text-xs text-green-600">
                          {formatPrice(option.price_modifier)}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Object.keys(selectedOptions).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                انتخاب‌های شما:
              </div>
              {Object.values(selectedOptions).map((option, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>{option.attributeName}: {option.optionValue}</span>
                  <span className="text-green-600">
                    {formatPrice(option.priceModifier)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between items-center font-semibold">
                <span>قیمت نهایی:</span>
                <span className="text-green-primary">
                  {formatPrice(Object.values(selectedOptions).reduce((sum, opt) => sum + opt.priceModifier, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCustomAttributeSelector;