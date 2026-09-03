import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/dashboard']

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix))

  if (isProtected && !user) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('next', request.nextUrl.pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    // getUser() above may have rotated/cleared the session cookie via
    // updateSession's setAll — that lives on supabaseResponse, so it has to
    // be copied onto whatever response we actually return, or the browser
    // keeps resending a stale cookie forever.
    supabaseResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie))
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
