import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="gap-1.5"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </Button>

      <span className="font-mono text-sm font-bold text-white px-3 py-1.5 bg-zinc-900 border-2 border-white rounded-lg shadow-[2px_2px_0px_0px_#FFFFFF]">
        Page <span className="text-[#FACC15]">{currentPage}</span> of{" "}
        <span>{totalPages}</span>
      </span>

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="gap-1.5"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
