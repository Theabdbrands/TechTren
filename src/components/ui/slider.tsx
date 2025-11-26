import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

// Helper function to get color at a specific position in the gradient
function getColorAtPosition(position: number, min: number, max: number): string {
  const percentage = (position - min) / (max - min)

  // Define gradient color stops
  const colors = [
    { position: 0, color: '#5131AD' },    // Green
    { position: 0.5, color: '#4F48B3' },  // Purple
    { position: 1, color: '#14E893' }     // Dark Purple
    // { position: 1, color: '#fff' }     // Dark Purple
  ]

  // Find which segment the percentage falls into
  for (let i = 0; i < colors.length - 1; i++) {
    const start = colors[i]
    const end = colors[i + 1]

    if (percentage >= start.position && percentage <= end.position) {
      // const segmentPercentage = (percentage - start.position) / (end.position - start.position)

      // Simple interpolation (you can use more sophisticated color interpolation if needed)
      return percentage < 0.5 ? start.color : end.color
    }
  }

  return colors[colors.length - 1].color
}

// Custom thumb component with dynamic color
const CustomThumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb> & {
    position: number
    min: number
    max: number
  }
>(({ position, min, max, className, ...props }, ref) => {
  const thumbColor = getColorAtPosition(position, min, max)

  return (
    <SliderPrimitive.Thumb
      ref={ref}
      className={cn(
        "block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-all duration-200 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: thumbColor,
        borderColor: thumbColor,
        boxShadow: `0 0 0 2px white, 0 2px 6px ${thumbColor}40, 0 4px 12px ${thumbColor}80 !important`,
      }}
      {...props}
    />
  )
})
CustomThumb.displayName = "CustomThumb"

// Main Slider component
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full bg-gradient-to-r from-[#5131AD] via-[#4F48B3] to-[#14E893]"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <CustomThumb
          key={index}
          position={_values[index]}
          min={min}
          max={max}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }