import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Service-role Supabase client. BYPASSES RLS.
 * Only import this from server-side code ("use server" actions / route handlers).
 * SUPABASE_SERVICE_ROLE_KEY must NEVER be prefixed with NEXT_PUBLIC_.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
