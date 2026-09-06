import { createClient } from "@supabase/supabase-js";

/**
 * Supabase configuration for Luma Radio accounts.
 *
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your environment
 * (.env locally, or your hosting provider's environment variables in
 * production — see README.md "Future Supabase integration").
 *
 * The anon key is safe to expose in client-side code — it's designed for
 * that — access control happens via Supabase's Row Level Security policies
 * on your tables, not by keeping this key secret.
 */
function readEnv(key: string): string {
  const value = (import.meta as unknown as { env: Record<string, string | undefined> }).env[key];
  return value?.trim() ?? "";
}

const supabaseUrl = readEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = readEnv("VITE_SUPABASE_ANON_KEY");

/** True once both Supabase environment variables have been set. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * The Supabase client. If env vars aren't set yet, this points at a
 * placeholder URL so the app doesn't crash on import — auth calls will
 * simply fail gracefully (see AuthContext) until real values are provided.
 */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
