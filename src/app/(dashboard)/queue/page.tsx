import { createClient } from "@/lib/supabase/server";
import { QueueView } from "@/components/queue/queue-view";
import { Problem } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialQuests: Problem[] = [];

  if (user) {
    // Ambil antrean soal aktif dengan urutan LIFO (created_at DESC)
    const { data } = await supabase
      .from("problems")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_completed", false)
      .order("created_at", { ascending: false });

    if (data) {
      initialQuests = data as Problem[];
    }
  }

  return <QueueView initialQuests={initialQuests} />;
}
