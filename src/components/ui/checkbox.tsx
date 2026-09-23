import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  id,
}) => {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative flex h-6 w-6 items-center justify-center rounded-md border-[2.5px] border-white transition-all duration-100 select-none cursor-pointer",
        checked
          ? "bg-[#22C55E] text-black shadow-[2px_2px_0px_0px_#FFFFFF]"
          : "bg-secondary hover:bg-zinc-700 shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {checked && <Check className="h-4 w-4 stroke-[3.5]" />}
    </button>
  );
};
