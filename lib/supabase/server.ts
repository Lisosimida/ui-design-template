import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// The anon key is safe to read from plain env vars (not a Cloudflare secret):
// Supabase's security boundary is RLS, not the secrecy of this key — it's
// designed to be shipped to the browser. See supabase/migrations for the
// RLS policies that are the actual enforcement point.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component, which can't set cookies — safe
            // to ignore because the middleware below refreshes the session
            // on every request anyway.
          }
        },
      },
    }
  )
}
