"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUsernameAction(newUsername: string) {
  const trimmed = newUsername?.trim();
  if (!trimmed || trimmed.length < 3) {
    return { error: "Username minimal 3 karakter!" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terotentikasi" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: trimmed })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Username ini sudah digunakan! Silakan pilih yang lain." };
    }
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateAvatarAction(avatarUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tidak terotentikasi" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  return { success: true };
}
