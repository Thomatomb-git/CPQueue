"use client";

import * as React from "react";
import { MoreVertical, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { reQueueQuestAction, deleteQuestAction } from "@/lib/actions/quests";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";

export interface HistoryRowActionsProps {
  questId: string;
  questTitle: string;
  onActionComplete?: () => void;
}

export const HistoryRowActions: React.FC<HistoryRowActionsProps> = ({
  questId,
  questTitle,
  onActionComplete,
}) => {
  const [open, setOpen] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { error, success } = useToast();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReQueue = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await reQueueQuestAction(questId);
      if (res?.error) {
        error(res.error, "Failed to Re-queue Quest");
      } else {
        success(`Quest "${questTitle}" returned to active queue!`);
        onActionComplete?.();
      }
    } catch {
      error("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePermanent = async () => {
    setLoading(true);
    try {
      const res = await deleteQuestAction(questId);
      if (res?.error) {
        error(res.error, "Delete Failed");
      } else {
        success(`Quest "${questTitle}" permanently deleted.`);
        onActionComplete?.();
      }
    } catch {
      error("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={loading}
          aria-label="Actions menu"
          className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white bg-zinc-800 text-white shadow-[2px_2px_0px_0px_#FFFFFF] hover:bg-zinc-700 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </button>

        {open && (
          <div className="absolute right-0 bottom-full mb-2 w-52 rounded-xl border-[2.5px] border-white bg-surface p-1.5 shadow-[4px_4px_0px_0px_#FFFFFF] z-30 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={handleReQueue}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-white hover:bg-zinc-800 hover:text-[#FACC15] transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-[#FACC15]" />
              <span>Add Back to Queue</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowDeleteModal(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Permanently</span>
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Quest Permanently?"
        description={`Are you sure you want to permanently delete "${questTitle}"? This history data cannot be recovered.`}
        confirmLabel="Delete Permanently"
        isDestructive={true}
        onConfirm={handleDeletePermanent}
      />
    </>
  );
};
