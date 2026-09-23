import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const FALLBACK_BG_COLORS = [
  "bg-[#2563EB]", // TLX Blue
  "bg-[#FACC15] text-black", // VJudge Yellow
  "bg-[#0EA5E9]", // Luogu Cyan
  "bg-[#22C55E] text-black", // CSES Green
  "bg-[#EF4444]", // Red
  "bg-[#8B5CF6]", // Purple
];

function getHashColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_BG_COLORS.length;
  return FALLBACK_BG_COLORS[index];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "User",
  size = "md",
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-xl",
  };

  const initial = (name?.trim()?.charAt(0) || "U").toUpperCase();
  const bgColorClass = getHashColor(name || "User");

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[2.5px] border-white font-black select-none shadow-[2px_2px_0px_0px_#FFFFFF]",
        sizeClasses[size],
        className
      )}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center font-black",
            bgColorClass
          )}
        >
          {initial}
        </div>
      )}
    </div>
  );
};
