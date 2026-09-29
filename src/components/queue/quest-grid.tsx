"use client";

import * as React from "react";
import { Problem } from "@/types/database";
import { QuestCard } from "./quest-card";
import { Swords } from "lucide-react";

export interface QuestGridProps {
  quests: Problem[];
  onQuestSolved?: (id: string) => void;
  onQuestDeleted?: (id: string) => void;
}

export const QuestGrid: React.FC<QuestGridProps> = ({
  quests,
  onQuestSolved,
  onQuestDeleted,
}) => {
  if (quests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-zinc-700 bg-surface/50 p-12 text-center text-zinc-400">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-600 bg-zinc-800 text-zinc-400 mb-4">
          <Swords className="h-8 w-8" />
        </div>
        <h4 className="text-lg font-black text-white">Quest Queue is Empty!</h4>
        <p className="mt-1 text-sm text-zinc-400 max-w-sm">
          Paste a problem URL from Codeforces, AtCoder, TLX, or other platforms above to start practicing.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onSolved={onQuestSolved}
          onDeleted={onQuestDeleted}
        />
      ))}
    </div>
  );
};
