import * as React from "react";
import { CpPlatform } from "@/types/database";
import { PLATFORM_CONFIGS } from "@/lib/parser/constants";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  platform: CpPlatform;
  label?: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  platform,
  label,
  size = "md",
  className,
  ...props
}) => {
  const config = PLATFORM_CONFIGS[platform] || PLATFORM_CONFIGS.others;
  const displayLabel = label || config.name;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border-[2px] font-black uppercase tracking-wider select-none",
        config.badgeStyle,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
      {...props}
    >
      {displayLabel}
    </span>
  );
};
