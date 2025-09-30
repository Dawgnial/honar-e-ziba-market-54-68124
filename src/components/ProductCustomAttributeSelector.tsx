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

  // Auto-select first (cheapest) option for each attribute when attributes are loaded
  useEffect(() => {
    if (attributes.length > 0) {
      const initialSelections: Record<string, SelectedOption> = {};
      
      attributes.forEach(attribute => {
        if (attribute.options && attribute.options.length > 0) {
          // Options are already sorted by price (lowest first)
          const firstOption = attribute.options[0];
          initialSelections[attribute.id] = {
            attributeId: attribute.id,
            attributeName: attribute.name,
            optionId: firstOption.id,
            optionValue: firstOption.display_value,
            priceModifier: firstOption.price_modifier
          };
        }
      });
      
      setSelectedOptions(initialSelections);
    }
  }, [attributes]);

  useEffect(() => {
    const optionsArray = Object.values(selectedOptions);
    const totalPrice = optionsArray.reduce((sum, option) => sum + option.priceModifier, 0);
    // Send the total price as the product price, not as modifier
    onAttributeSelect(optionsArray, totalPrice);
  }, [selectedOptions, onAttributeSelect]);

  const handleOptionSelect = (attribute: ProductCustomAttribute, optionId: string) => {
    const option = attribute.options?.find(opt => opt.id === optionId);
    if (!option) return;

    setSelectedOptions(prev => {
      // Toggle: If clicking same option, deselect it
      if (prev[attribute.id]?.optionId === optionId) {
        const newState = { ...prev };
        delete newState[attribute.id];
        return newState;
      }

      // Select the new option
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
                      className={`flex flex-col h-auto py-2 px-3 transition-all ${
                        isSelected 
                          ? 'bg-persian-blue hover:bg-persian-blue/90 text-white ring-2 ring-persian-blue ring-offset-2' 
                          : 'hover:border-persian-blue'
                      }`}
                    >
                      <span>{option.display_value}</span>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-green-600'}`}>
                        {formatPrice(option.price_modifier)}
                      </span>
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
                ویژگی‌های انتخاب شده:
              </div>
              {Object.values(selectedOptions).map((option, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{option.attributeName}: <strong>{option.optionValue}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCustomAttributeSelector;