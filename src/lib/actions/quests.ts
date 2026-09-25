"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/parser/normalizer";
import { detectPlatformAndExtractTitle } from "@/lib/parser/detector";
import { revalidatePath } from "next/cache";

export async function addQuestAction(rawUrl: string) {
  if (!rawUrl || !rawUrl.trim()) {
    return { error: "URL soal tidak boleh kosong!" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Silakan login terlebih dahulu." };
  }

  const normalized = normalizeUrl(rawUrl);
  if (!normalized) {
    return { error: "URL tidak valid!" };
  }

  // 1. Cek duplikasi manual atau tangkap unique constraint
  const { data: existing } = await supabase
    .from("problems")
    .select("id, is_completed")
    .eq("user_id", user.id)
    .eq("normalized_url", normalized)
    .maybeSingle();

  if (existing) {
    return {
      error: "Quest ini sudah ada di log latihanmu!",
      isDuplicate: true,
    };
  }

  const { platform, title } = detectPlatformAndExtractTitle(normalized);

  const { error: insertError } = await supabase.from("problems").insert({
    user_id: user.id,
    url: rawUrl.trim(),
    normalized_url: normalized,
    platform,
    title,
    is_completed: false,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        error: "Quest ini sudah ada di log latihanmu!",
        isDuplicate: true,
      };
    }
    return { error: `Gagal menambahkan quest: ${insertError.message}` };
  }

  revalidatePath("/queue");
  return { success: true, title, platform };
}

export async function markQuestSolvedAction(problemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terotentikasi" };
  }

  const { data, error } = await supabase
    .from("problems")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("id", problemId)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return { error: "Gagal menandai selesai: data tidak ditemukan atau akses ditolak oleh RLS." };
  }

  revalidatePath("/queue");
  revalidatePath("/history");
  return { success: true };
}

export async function deleteQuestAction(problemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terotentikasi" };
  }

  const { data, error } = await supabase
    .from("problems")
    .delete()
    .eq("id", problemId)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return { error: "Gagal menghapus: data tidak ditemukan atau akses ditolak oleh RLS." };
  }

  revalidatePath("/queue");
  revalidatePath("/history");
  return { success: true };
}

/**
 * Reverts a quest from History back to Active Queue (LIFO top order).
 * PRD 8.3: update is_completed = false, clear completed_at, and update created_at to now.
 */
export async function reQueueQuestAction(problemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terotentikasi" };
  }

  const { data, error } = await supabase
    .from("problems")
    .update({
      is_completed: false,
      completed_at: null,
      created_at: new Date().toISOString(),
    })
    .eq("id", problemId)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return { error: "Gagal mengembalikan quest: data tidak ditemukan atau akses ditolak oleh RLS." };
  }

  revalidatePath("/queue");
  revalidatePath("/history");
  return { success: true };
}

export async function bulkDeleteQuestsAction(problemIds: string[]) {
  if (!problemIds || problemIds.length === 0) {
    return { success: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terotentikasi" };
  }

  const { data, error } = await supabase
    .from("problems")
    .delete()
    .in("id", problemIds)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return { error: "Gagal menghapus: tidak ada data yang terhapus. Kemungkinan akses ditolak oleh RLS." };
  }

  revalidatePath("/history");
  return { success: true };
}
