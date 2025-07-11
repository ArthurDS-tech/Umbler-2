import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@supabase/supabase-js"

// Client-side Supabase client (singleton pattern)
let browserSupabaseClient: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side client (for API routes, Server Components)
    return createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side operations
      {
        auth: {
          persistSession: false, // No session persistence on server
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    )
  }

  // Browser-side client (singleton to avoid multiple instances)
  if (!browserSupabaseClient) {
    browserSupabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    )
  }
  return browserSupabaseClient
}

// Function to get a fresh client instance (use sparingly)
export function createFreshClient() {
  if (typeof window === "undefined") {
    return createClient()
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
