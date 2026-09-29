"use client";

import * as React from "react";
import { Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { bulkDeleteQuestsAction } from "@/lib/actions/quests";
import { useToast } from "@/components/ui/toast";

export interface HistoryBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onDeleted?: () => void;
}

export const HistoryBulkActions: React.FC<HistoryBulkActionsProps> = ({
  selectedIds,
  onClearSelection,
  onDeleted,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { error, success } = useToast();

  if (selectedIds.length === 0) return null;

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      const res = await bulkDeleteQuestsAction(selectedIds);
      if (res?.error) {
        error(res.error, "Bulk Delete Failed");
      } else {
        success(`${selectedIds.length} history quests deleted successfully.`);
        onClearSelection();
        onDeleted?.();
      }
    } catch {
      error("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border-[3px] border-white bg-surface px-5 py-3 shadow-[6px_6px_0px_0px_#EF4444] animate-in slide-in-from-bottom-6 duration-200">
        <span className="font-mono text-sm font-black text-white">
          <span className="text-[#FACC15]">{selectedIds.length}</span> Quests Selected
        </span>

        <div className="h-5 w-[2px] bg-zinc-700" />

        <Button
          variant="danger"
          size="sm"
          disabled={loading}
          onClick={() => setShowModal(true)}
          className="gap-2 text-xs uppercase tracking-wider"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span>Delete ({selectedIds.length}) Selected</span>
        </Button>

        <button
          onClick={onClearSelection}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Bulk Delete"
        description={`Are you sure you want to permanently delete ${selectedIds.length} selected history quests? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length} Quests`}
        isDestructive={true}
        onConfirm={handleBulkDelete}
      />
    </>
  );
};
