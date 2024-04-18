import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

  const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
      return (
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md bg-background px-3 py-2 text-base sm:text-sm",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "transition-all ease-in-out duration-150",
            "ring-offset-background focus-visible:shadow-blue-500/25 focus-visible:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
            "over:outline outline outline-gray-200 hover:outline-gray-300 outline-1",
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
