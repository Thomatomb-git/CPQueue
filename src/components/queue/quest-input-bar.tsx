"use client";

import * as React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addQuestAction } from "@/lib/actions/quests";
import { useToast } from "@/components/ui/toast";

interface QuestInputBarProps {
  onQuestAdded?: () => void;
}

export const QuestInputBar: React.FC<QuestInputBarProps> = ({ onQuestAdded }) => {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { error, success } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await addQuestAction(url);
      if (res?.error) {
        error(res.error, res.isDuplicate ? "QUEST DUPLIKAT!" : "GAGAL INPUT");
      } else {
        success(`Quest "${res.title}" berhasil ditambahkan ke antrean!`);
        setUrl("");
        onQuestAdded?.();
      }
    } catch {
      error("Terjadi kesalahan jaringan saat menambahkan quest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Paste URL Soal (Codeforces, AtCoder, TLX, VJudge, Luogu, CSES...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="w-full h-12 text-sm sm:text-base font-mono"
            autoComplete="off"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !url.trim()}
          className="h-12 px-6 gap-2 text-sm sm:text-base font-black shrink-0 tracking-wide"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>PARSING...</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 stroke-[3]" />
              <span>+ ADD QUEST</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
