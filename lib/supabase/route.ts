import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

// Postgres' error code for a malformed UUID literal — a resume id route
// param that isn't valid UUID syntax surfaces this from any query filtering
// on it, and callers map it to 400 rather than a generic 500.
const POSTGRES_INVALID_UUID = '22P02'

// Shared by every /api/resumes/[id]* route handler that filters a query by
// the id param: returns the 400 response when `error` is a malformed-UUID
// error, or null when it's some other error the caller should handle itself.
export function invalidResumeIdResponse(error: { code?: string } | null): Response | null {
  if (error?.code !== POSTGRES_INVALID_UUID) return null
  return Response.json({ error: 'Invalid resume id.' }, { status: 400 })
}

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

// Shared by every /api/resumes* route handler that needs to know who's
// asking — creates the client and resolves the current user in one step, so
// each handler's own 401 message is the only per-route auth code left.
export async function getRequestUser(request: NextRequest) {
  const supabase = createRouteClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}
