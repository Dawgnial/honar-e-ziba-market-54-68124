import React, { useState, useEffect, useCallback } from "react";
import { ImprovedRangeSlider } from "@/components/ui/improved-range-slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react";
import { formatPriceToFarsi } from "@/utils/numberUtils";
import { useDebouncedCallback } from "@/hooks/use-debounce";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  className?: string;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  value,
  onChange,
  className
}) => {
  const [localRange, setLocalRange] = useState<[number, number]>(value);
  const [manualMin, setManualMin] = useState<string>(value[0].toString());
  const [manualMax, setManualMax] = useState<string>(value[1].toString());
  const [isActive, setIsActive] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalRange(value);
    setManualMin(value[0].toString());
    setManualMax(value[1].toString());
  }, [value]);

  // Debounced onChange for smooth slider movement
  const debouncedOnChange = useDebouncedCallback((newRange: [number, number]) => {
    onChange(newRange);
  }, 100);

  const handleSliderChange = useCallback((values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalRange(newRange);
    setManualMin(newRange[0].toString());
    setManualMax(newRange[1].toString());
    debouncedOnChange(newRange);
  }, [debouncedOnChange]);

  const handleManualChange = useCallback(() => {
    const min = Math.max(parseInt(manualMin) || minPrice, minPrice);
    const max = Math.min(parseInt(manualMax) || maxPrice, maxPrice);
    const validatedRange: [number, number] = [
      Math.min(min, max),
      Math.max(min, max)
    ];
    
    setLocalRange(validatedRange);
    setManualMin(validatedRange[0].toString());
    setManualMax(validatedRange[1].toString());
    onChange(validatedRange);
  }, [manualMin, manualMax, minPrice, maxPrice, onChange]);

  const handleReset = useCallback(() => {
    const resetRange: [number, number] = [minPrice, maxPrice];
    setLocalRange(resetRange);
    setManualMin(resetRange[0].toString());
    setManualMax(resetRange[1].toString());
    onChange(resetRange);
  }, [minPrice, maxPrice, onChange]);

  const hasActiveFilter = localRange[0] !== minPrice || localRange[1] !== maxPrice;
  const step = Math.max(1000, Math.ceil((maxPrice - minPrice) / 200));

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        isActive ? 'ring-2 ring-blue-500/30 shadow-xl' : 'shadow-lg hover:shadow-xl'
      } ${className || ''}`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                محدوده قیمت
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                قیمت مورد نظر خود را انتخاب کنید
              </p>
            </div>
          </div>
          
          {hasActiveFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 border-gray-200 hover:border-gray-300 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 ml-1" />
              بازنشانی
            </Button>
          )}
        </div>

        {/* Active Filter Badge */}
        {hasActiveFilter && (
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 px-3 py-1"
            >
              {formatPriceToFarsi(localRange[0])} - {formatPriceToFarsi(localRange[1])} تومان
            </Badge>
          </div>
        )}

        {/* Enhanced Slider */}
        <div className="mb-8">
          <ImprovedRangeSlider
            value={localRange}
            onValueChange={handleSliderChange}
            min={minPrice}
            max={maxPrice}
            step={step}
            className="w-full"
            showValues={true}
            formatValue={(value) => formatPriceToFarsi(value)}
          />
        </div>

        {/* Manual Input Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-500" />
              حداقل قیمت
            </label>
            <div className="relative">
              <Input
                type="number"
                value={manualMin}
                onChange={(e) => setManualMin(e.target.value)}
                onBlur={handleManualChange}
                onKeyDown={(e) => e.key === 'Enter' && handleManualChange()}
                className="pr-14 h-11 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all bg-white/70 dark:bg-gray-800/70"
                placeholder={minPrice.toString()}
                min={minPrice}
                max={maxPrice}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                تومان
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              حداکثر قیمت
            </label>
            <div className="relative">
              <Input
                type="number"
                value={manualMax}
                onChange={(e) => setManualMax(e.target.value)}
                onBlur={handleManualChange}
                onKeyDown={(e) => e.key === 'Enter' && handleManualChange()}
                className="pr-14 h-11 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl transition-all bg-white/70 dark:bg-gray-800/70"
                placeholder={maxPrice.toString()}
                min={minPrice}
                max={maxPrice}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                تومان
              </span>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
};