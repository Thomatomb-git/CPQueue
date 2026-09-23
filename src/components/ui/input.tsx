import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full rounded-lg border-[2.5px] border-white bg-secondary px-4 py-2.5 text-sm text-white placeholder:text-zinc-500",
          "outline-none transition-all duration-100",
          "focus:border-[#FACC15] focus:shadow-[4px_4px_0px_0px_#FACC15]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
