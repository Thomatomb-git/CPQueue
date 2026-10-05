"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateUsername } from "@/lib/utils/username";
import { redirect } from "next/navigation";

const INVALID_CREDENTIALS = "Invalid login credentials";

export async function loginAction(formData: FormData) {
  const identifier = ((formData.get("identifier") as string) || "").trim();
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Username/email and password are required!" };
  }

  let email = identifier.toLowerCase();

  // No '@' -> treat as username and resolve it to an email server-side.
  if (!identifier.includes("@")) {
    if (validateUsername(identifier)) {
      return { error: INVALID_CREDENTIALS };
    }

    try {
      const admin = createAdminClient();
      const { data, error } = await admin.rpc("get_email_by_username", {
        p_username: identifier,
      });
      if (error || !data) {
        // Same message as a wrong password so usernames can't be enumerated.
        return { error: INVALID_CREDENTIALS };
      }
      email = data;
    } catch {
      return { error: "Username login is temporarily unavailable. Please use your email." };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/queue");
}

export async function registerAction(formData: FormData) {
  const username = ((formData.get("username") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { error: "All fields (username, email, password) are required!" };
  }

  const usernameError = validateUsername(username);
  if (usernameError) {
    return { error: usernameError };
  }

  const supabase = await createClient();

  // 1. Username must be unique (case-insensitive).
  const { data: available, error: availError } = await supabase.rpc(
    "is_username_available",
    { p_username: username }
  );
  if (availError) {
    return { error: `Failed to check username: ${availError.message}` };
  }
  if (!available) {
    return { error: "This username is already taken! Please choose another." };
  }

  // 2. Create the auth user (email uniqueness is enforced by Supabase Auth).
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || error.code === "user_already_exists") {
      return { error: "This email is already registered! Please sign in instead." };
    }
    // Profile trigger hit the unique username index (race condition).
    if (msg.includes("database error saving new user")) {
      return { error: "This username is already taken! Please choose another." };
    }
    return { error: error.message };
  }

  // With "Confirm email" enabled, Supabase does NOT return an error for an
  // existing email (anti-enumeration). It returns a fake user with no identities.
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return { error: "This email is already registered! Please sign in instead." };
  }

  // Email confirmation required -> no session yet.
  if (!data.session) {
    return {
      success: true,
      needsConfirmation: true,
      message: "Account created! Check your inbox to confirm your email, then sign in.",
    };
  }

  redirect("/queue");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
