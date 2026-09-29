"use client";

import * as React from "react";
import { Problem } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HistoryRowActions } from "./history-row-actions";
import { HistoryBulkActions } from "./history-bulk-actions";
import { ExternalLink, History as HistoryIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface HistoryTableProps {
  initialQuests: Problem[];
}

function formatSolvedTime(dateString: string | null): string {
  if (!dateString) return "Just now";
  try {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const day = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `Solved ${time}, ${day}`;
  } catch {
    return "Solved";
  }
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ initialQuests }) => {
  const [quests, setQuests] = React.useState<Problem[]>(initialQuests);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Sync state if props change
  React.useEffect(() => {
    setQuests(initialQuests);
  }, [initialQuests]);

  const filteredQuests = React.useMemo(() => {
    if (!searchQuery.trim()) return quests;
    const query = searchQuery.toLowerCase();
    return quests.filter(
      (q) =>
        q.title.toLowerCase().includes(query) ||
        q.platform.toLowerCase().includes(query) ||
        q.url.toLowerCase().includes(query)
    );
  }, [quests, searchQuery]);

  const allFilteredSelected =
    filteredQuests.length > 0 &&
    filteredQuests.every((q) => selectedIds.includes(q.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = Array.from(new Set([...selectedIds, ...filteredQuests.map((q) => q.id)]));
      setSelectedIds(allIds);
    } else {
      const filteredIdSet = new Set(filteredQuests.map((q) => q.id));
      setSelectedIds(selectedIds.filter((id) => !filteredIdSet.has(id)));
    }
  };

  const handleToggleRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleRowRemoved = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleBulkRemoved = () => {
    setQuests((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
    setSelectedIds([]);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search solved problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs font-mono"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>

        <div className="font-mono text-xs font-bold text-zinc-400 self-end sm:self-center">
          Total Solved: <span className="text-[#FACC15]">{quests.length}</span> Quests
        </div>
      </div>

      {/* Table Container */}
      {filteredQuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-zinc-700 bg-surface/50 p-12 text-center text-zinc-400">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-zinc-600 bg-zinc-800 text-zinc-400 mb-3">
            <HistoryIcon className="h-7 w-7" />
          </div>
          <h4 className="text-base font-black text-white">No History Yet</h4>
          <p className="mt-1 text-xs text-zinc-400 max-w-xs">
            Problems you mark as solved in the active queue will automatically appear in this table.
          </p>
        </div>
      ) : (
        <div className="overflow-visible rounded-xl border-[2.5px] border-white bg-surface shadow-[4px_4px_0px_0px_#FFFFFF]">
          <table className="w-full text-left text-sm text-white">
            <thead className="border-b-[2.5px] border-white bg-secondary/80 font-mono text-xs uppercase tracking-wider text-zinc-300">
              <tr>
                <th scope="col" className="w-12 px-4 py-3.5 text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="w-32 px-4 py-3.5">
                  Platform
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Problem Title & Link
                </th>
                <th scope="col" className="w-52 px-4 py-3.5 text-right font-mono hidden sm:table-cell">
                  Solved At
                </th>
                <th scope="col" className="w-16 px-4 py-3.5 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-zinc-800/80">
              {filteredQuests.map((quest) => {
                const isSelected = selectedIds.includes(quest.id);

                return (
                  <tr
                    key={quest.id}
                    className={`transition-colors hover:bg-zinc-800/50 ${
                      isSelected ? "bg-zinc-800/80" : ""
                    }`}
                  >
                    {/* Checkbox Col */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleToggleRow(quest.id, checked)}
                        />
                      </div>
                    </td>

                    {/* Platform Badge Col */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge platform={quest.platform} size="sm" />
                    </td>

                    {/* Title & Link Col */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-sm font-bold text-white line-through decoration-zinc-500">
                          {quest.title}
                        </span>
                        <a
                          href={quest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400 hover:text-[#FACC15] transition-colors truncate max-w-sm sm:max-w-md"
                        >
                          <span className="truncate">{quest.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    </td>

                    {/* Solved Time Col */}
                    <td className="px-4 py-3 text-right font-mono text-xs text-zinc-400 hidden sm:table-cell whitespace-nowrap">
                      <span
                        suppressHydrationWarning
                        className="inline-block px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold"
                      >
                        {formatSolvedTime(quest.completed_at || quest.created_at)}
                      </span>
                    </td>

                    {/* 3-dots Menu Col */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <HistoryRowActions
                          questId={quest.id}
                          questTitle={quest.title}
                          onActionComplete={() => handleRowRemoved(quest.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      <HistoryBulkActions
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onDeleted={handleBulkRemoved}
      />
    </div>
  );
};
