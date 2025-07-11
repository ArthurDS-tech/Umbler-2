import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@supabase/supabase-js"

// Client-side Supabase client (for use in browser components)
// Use a singleton pattern to avoid creating multiple clients
let browserSupabaseClient: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side client (for API routes, Server Components)
    // Ensure these environment variables are available in your Vercel project settings
    return createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side operations
      {
        auth: {
          persistSession: false, // No session persistence on server
        },
      },
    )
  }

  // Browser-side client
  if (!browserSupabaseClient) {
    browserSupabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return browserSupabaseClient
}
