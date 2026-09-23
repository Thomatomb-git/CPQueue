"use client";

import * as React from "react";
import { CpPlatform } from "@/types/database";
import { ALL_PLATFORMS, PLATFORM_CONFIGS } from "@/lib/parser/constants";
import { cn } from "@/lib/utils/cn";

export type FilterValue = "all" | CpPlatform;

export interface QuestFilterProps {
  selectedFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  counts?: Record<FilterValue, number>;
}

export const QuestFilter: React.FC<QuestFilterProps> = ({
  selectedFilter,
  onFilterChange,
  counts,
}) => {
  const filters: { id: FilterValue; label: string; color?: string }[] = [
    { id: "all", label: "ALL" },
    ...ALL_PLATFORMS.map((p) => ({
      id: p,
      label: PLATFORM_CONFIGS[p].name,
      color: PLATFORM_CONFIGS[p].brandColor,
    })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-black uppercase text-zinc-400 mr-1 shrink-0 font-mono">
        Filter:
      </span>
      {filters.map((f) => {
        const isActive = selectedFilter === f.id;
        const count = counts ? counts[f.id] : undefined;

        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border-[2px] px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer",
              isActive
                ? "border-white bg-[#FACC15] text-black shadow-[3px_3px_0px_0px_#FFFFFF]"
                : "border-white bg-surface text-zinc-300 shadow-[2px_2px_0px_0px_#FFFFFF] hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
            )}
          >
            {f.color && (
              <span
                className="h-2 w-2 rounded-full border border-black/40"
                style={{ backgroundColor: f.color }}
              />
            )}
            <span>{f.label}</span>
            {count !== undefined && (
              <span
                className={cn(
                  "ml-0.5 text-[10px] font-mono px-1 rounded-sm",
                  isActive ? "bg-black/20 text-black font-black" : "bg-zinc-800 text-zinc-400"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
