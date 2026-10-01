import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Returns a Supabase client, or null when env isn't set yet (slices 1–4 run
// without a backend; the community feed is the only consumer). Memoized.
let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key) : null;
  return client;
}
