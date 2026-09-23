import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadowColor?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadowColor, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          boxShadow: shadowColor ? `4px 4px 0px 0px ${shadowColor}` : "4px 4px 0px 0px #FFFFFF",
          ...style,
        }}
        className={cn(
          "rounded-xl border-[2.5px] border-white bg-surface p-5 text-white transition-all duration-150",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
