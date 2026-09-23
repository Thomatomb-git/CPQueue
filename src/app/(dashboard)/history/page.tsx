import { createClient } from "@/lib/supabase/server";
import { HistoryTable } from "@/components/history/history-table";
import { Problem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let solvedQuests: Problem[] = [];

  if (user) {
    const { data } = await supabase
      .from("problems")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_completed", true)
      .order("completed_at", { ascending: false, nullsFirst: false });

    if (data) {
      solvedQuests = data as Problem[];
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-mono text-2xl font-black tracking-tight text-white sm:text-3xl">
          Riwayat <span className="text-[#FACC15]">Terselesaikan</span>
        </h1>
        <p className="text-xs sm:text-sm font-medium text-zinc-400">
          Daftar seluruh soal yang telah berhasil Anda upsolve. Anda dapat mengembalikannya ke antrean atau menghapusnya.
        </p>
      </div>

      <HistoryTable initialQuests={solvedQuests} />
    </div>
  );
}
