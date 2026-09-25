"use client";

import * as React from "react";
import { Problem } from "@/types/database";
import { QuestInputBar } from "./quest-input-bar";
import { QuestFilter, FilterValue } from "./quest-filter";
import { QuestGrid } from "./quest-grid";
import { Pagination } from "@/components/ui/pagination";
import { ALL_PLATFORMS } from "@/lib/parser/constants";
import { useRouter } from "next/navigation";

export interface QueueViewProps {
  initialQuests: Problem[];
}

const ITEMS_PER_PAGE = 24; // Sesuai PRD: 20–25 kartu per halaman

export const QueueView: React.FC<QueueViewProps> = ({ initialQuests }) => {
  const [quests, setQuests] = React.useState<Problem[]>(initialQuests);
  const [selectedFilter, setSelectedFilter] = React.useState<FilterValue>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const router = useRouter();

  // Sync state with server props
  React.useEffect(() => {
    setQuests(initialQuests);
  }, [initialQuests]);

  // Hitung jumlah soal per platform untuk label badge filter
  const counts = React.useMemo(() => {
    const map: Record<FilterValue, number> = {
      all: quests.length,
      codeforces: 0,
      atcoder: 0,
      tlx: 0,
      vjudge: 0,
      luogu: 0,
      cses: 0,
      others: 0,
    };

    quests.forEach((q) => {
      if (map[q.platform] !== undefined) {
        map[q.platform]++;
      } else {
        map.others++;
      }
    });

    return map;
  }, [quests]);

  // Filter berdasarkan platform
  const filteredQuests = React.useMemo(() => {
    if (selectedFilter === "all") return quests;
    return quests.filter((q) => q.platform === selectedFilter);
  }, [quests, selectedFilter]);

  // Hitung paginasi
  const totalPages = Math.max(1, Math.ceil(filteredQuests.length / ITEMS_PER_PAGE));

  // Reset page jika ganti filter dan page sekarang > totalPages
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [selectedFilter, totalPages, currentPage]);

  const paginatedQuests = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuests, currentPage]);

  const handleQuestSolved = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const handleQuestDeleted = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const handleQuestAdded = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* 1. URL Input Bar */}
      <section className="rounded-2xl border-[3px] border-white bg-surface p-4 sm:p-6 shadow-[5px_5px_0px_0px_#FFFFFF]">
        <h2 className="mb-3 text-xs font-black uppercase tracking-wider text-zinc-400 font-mono">
          Input URL Soal
        </h2>
        <QuestInputBar onQuestAdded={handleQuestAdded} />
      </section>

      {/* 2. Platform Filters */}
      <section className="pt-2">
        <QuestFilter
          selectedFilter={selectedFilter}
          onFilterChange={(filter) => {
            setSelectedFilter(filter);
            setCurrentPage(1);
          }}
          counts={counts}
        />
      </section>

      {/* 3. Cards Grid (LIFO Order) */}
      <section className="pt-1">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-zinc-400">
            Menampilkan: <span className="text-white font-black">{filteredQuests.length}</span> Quest Aktif
          </span>
          {selectedFilter !== "all" && (
            <button
              onClick={() => setSelectedFilter("all")}
              className="text-xs font-mono font-bold text-[#FACC15] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <QuestGrid
          quests={paginatedQuests}
          onQuestSolved={handleQuestSolved}
          onQuestDeleted={handleQuestDeleted}
        />

        {/* 4. Retro Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>
    </div>
  );
};
