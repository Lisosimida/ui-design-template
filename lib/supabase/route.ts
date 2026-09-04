import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

// Route Handlers can read cookies straight off the NextRequest, unlike
// Server Components/Actions which need next/headers' cookies() — using this
// (not lib/supabase/server.ts) keeps route handlers callable directly from
// tests with no live Next.js request context, the same reason proxy.ts /
// lib/supabase/middleware.ts read cookies off the request instead.
export function createRouteClient(request: NextRequest) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {
        // The site-wide proxy (proxy.ts) already refreshes the session
        // cookie on every request before this handler runs.
      },
    },
  })
}
