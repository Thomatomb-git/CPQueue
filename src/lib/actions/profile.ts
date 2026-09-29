"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUsernameAction(newUsername: string) {
  const trimmed = newUsername?.trim();
  if (!trimmed || trimmed.length < 3) {
    return { error: "Username must be at least 3 characters!" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: trimmed })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "This username is already taken! Please choose another." };
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
    return { error: "Not authenticated" };
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
