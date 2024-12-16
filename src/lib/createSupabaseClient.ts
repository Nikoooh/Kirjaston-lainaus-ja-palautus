import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const runtimeConfig = useRuntimeConfig();
  return createBrowserClient(
    runtimeConfig.public.SUPABASE_URL!,
    runtimeConfig.public.SUPABASE_ANON_KEY!
  )
}