import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CustomPriceSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  showInputs?: boolean;
  formatValue?: (value: number) => string;
}

export const CustomPriceSlider: React.FC<CustomPriceSliderProps> = ({
  value,
  onChange,
  min = 25000,
  max = 1000000,
  step = 1000,
  className,
  showInputs = true,
  formatValue = (val) => `$${val.toLocaleString()}`
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label>Price Range</Label>
        {showInputs && (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={value[0]}
              onChange={(e) => onChange([Number(e.target.value), value[1]])}
              className="w-24"
              min={min}
              max={value[1]}
            />
            <span>to</span>
            <Input
              type="number"
              value={value[1]}
              onChange={(e) => onChange([value[0], Number(e.target.value)])}
              className="w-24"
              min={value[0]}
              max={max}
            />
          </div>
        )}
      </div>
      
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onChange}
        className="mt-4"
      />
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
    </div>
  );
}; 