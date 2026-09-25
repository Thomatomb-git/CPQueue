"use client";

import * as React from "react";
import { ExternalLink, X, Loader2 } from "lucide-react";
import { Problem } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PLATFORM_CONFIGS } from "@/lib/parser/constants";
import { markQuestSolvedAction, deleteQuestAction } from "@/lib/actions/quests";
import { triggerQuestSolvedConfetti } from "@/lib/utils/confetti";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

export interface QuestCardProps {
  quest: Problem;
  onSolved?: (id: string) => void;
  onDeleted?: (id: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  onSolved,
  onDeleted,
}) => {
  const [isSolving, setIsSolving] = React.useState(false);
  const [isDismissing, setIsDismissing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { error, success } = useToast();

  const platformConfig = PLATFORM_CONFIGS[quest.platform] || PLATFORM_CONFIGS.others;

  const handleMarkSolved = async () => {
    if (isSolving || isDismissing) return;

    setIsSolving(true);
    triggerQuestSolvedConfetti(cardRef.current);

    // Tunggu sedikit agar animasi strike-through dan confetti dinikmati pengguna
    setTimeout(async () => {
      setIsDismissing(true);

      try {
        const res = await markQuestSolvedAction(quest.id);
        if (res?.error) {
          error(res.error, "Gagal Menyelesaikan Quest");
          setIsSolving(false);
          setIsDismissing(false);
        } else {
          success(`Quest "${quest.title}" selesai! Ditambahkan ke histori.`);
          setTimeout(() => {
            onSolved?.(quest.id);
          }, 350);
        }
      } catch {
        error("Terjadi galat jaringan.");
        setIsSolving(false);
        setIsDismissing(false);
      }
    }, 400);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const res = await deleteQuestAction(quest.id);
      if (res?.error) {
        error(res.error, "Gagal Menghapus Quest");
        setIsDeleting(false);
      } else {
        success(`Quest "${quest.title}" dihapus.`);
        onDeleted?.(quest.id);
      }
    } catch {
      error("Terjadi galat jaringan.");
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={cardRef}
      style={{
        boxShadow: `4px 4px 0px 0px ${platformConfig.brandColor}`,
      }}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border-[2.5px] border-white bg-surface p-5 text-white transition-all duration-200",
        "hover:-translate-x-0.5 hover:-translate-y-0.5",
        isDismissing && "animate-solve-dismiss pointer-events-none"
      )}
    >
      {/* Top Header: Badge Platform & Delete [X] */}
      <div className="flex items-center justify-between gap-3">
        <Badge platform={quest.platform} />

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isSolving}
          aria-label="Delete quest"
          className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-white bg-zinc-800 text-zinc-400 hover:bg-red-600 hover:text-white transition-colors active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-4 w-4 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Main Content: Title */}
      <div className="my-4">
        <h3
          className={cn(
            "font-mono text-lg font-black tracking-tight text-white transition-all",
            isSolving && "animate-strike line-through text-zinc-400"
          )}
        >
          {quest.title}
        </h3>

        {/* External Problem Link */}
        <a
          href={quest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-zinc-400 hover:text-[#FACC15] transition-colors break-all"
        >
          <span className="truncate max-w-[240px] sm:max-w-xs">{quest.url}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      </div>

      {/* Bottom Action: Checkbox Mark as Solved */}
      <div className="mt-2 flex items-center justify-between border-t-2 border-zinc-800/80 pt-3">
        <label
          htmlFor={`solve-${quest.id}`}
          className="flex items-center gap-2.5 cursor-pointer select-none group/solve"
        >
          <Checkbox
            id={`solve-${quest.id}`}
            checked={isSolving}
            disabled={isSolving || isDeleting}
            onCheckedChange={handleMarkSolved}
          />
          <span
            className={cn(
              "text-xs font-black tracking-wider uppercase transition-colors",
              isSolving
                ? "text-emerald-400"
                : "text-zinc-300 group-hover/solve:text-white"
            )}
          >
            {isSolving ? "ACCEPTED!" : "MARK AS SOLVED"}
          </span>
        </label>

        <span suppressHydrationWarning className="text-[10px] font-mono text-zinc-500">
          {new Date(quest.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </div>
  );
};
