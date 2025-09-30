import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface ImprovedRangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  formatValue?: (value: number) => string;
  showValues?: boolean;
}

const ImprovedRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  ImprovedRangeSliderProps
>(({ className, formatValue, showValues = false, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const values = props.value || props.defaultValue || [0, 100];

  return (
    <div className="relative w-full">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center py-4",
          className
        )}
        onValueChange={(newValues) => {
          props.onValueChange?.(newValues);
        }}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        {...props}
      >
        {/* Track */}
        <SliderPrimitive.Track 
          className="relative h-3 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 shadow-inner"
        >
          {/* Range */}
          <SliderPrimitive.Range 
            className="absolute h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full transition-all duration-300 shadow-sm" 
          />
        </SliderPrimitive.Track>
        
        {/* First Thumb */}
        <SliderPrimitive.Thumb 
          className={cn(
            "relative block h-6 w-6 rounded-full border-3 border-white bg-gradient-to-br from-green-500 to-green-600 shadow-lg ring-offset-background transition-all duration-300 cursor-grab active:cursor-grabbing z-10",
            "hover:h-7 hover:w-7 hover:shadow-xl hover:ring-4 hover:ring-green-500/40 hover:scale-110",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/50",
            "disabled:pointer-events-none disabled:opacity-50",
            isDragging && "h-7 w-7 shadow-xl ring-4 ring-green-500/40 scale-110"
          )}
        />
        
        {/* Second Thumb */}
        <SliderPrimitive.Thumb 
          className={cn(
            "relative block h-6 w-6 rounded-full border-3 border-white bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg ring-offset-background transition-all duration-300 cursor-grab active:cursor-grabbing z-10",
            "hover:h-7 hover:w-7 hover:shadow-xl hover:ring-4 hover:ring-emerald-500/40 hover:scale-110",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50",
            "disabled:pointer-events-none disabled:opacity-50",
            isDragging && "h-7 w-7 shadow-xl ring-4 ring-emerald-500/40 scale-110"
          )}
        />
      </SliderPrimitive.Root>
      
      {/* Value Labels - Fixed for RTL */}
      {showValues && formatValue && (
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {formatValue(values[1])}
          </span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            {formatValue(values[0])}
          </span>
        </div>
      )}
    </div>
  );
});

ImprovedRangeSlider.displayName = "ImprovedRangeSlider";

export { ImprovedRangeSlider };