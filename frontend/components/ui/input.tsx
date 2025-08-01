import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Check if the className contains error border styling
    const hasErrorBorder = className?.includes('border-red-500');
    
    return (
      <input
        type={type}
        className={cn(
          "flex px-6 py-2.5 w-full rounded-lg border ease-linear duration-75 bg-transparent text-base transition-colors file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // Only apply focus border if there's no error border
          !hasErrorBorder && "focus:border-[#2f2f2f]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
