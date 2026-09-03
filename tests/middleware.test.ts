import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { middleware } from '../middleware'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Signs a fresh test user in through @supabase/ssr's own cookie-writing
// path, so the cookies handed to the middleware are in exactly the format
// it expects, rather than a hand-rolled guess at Supabase's cookie encoding.
async function signInAndCaptureCookies() {
  const jar = new Map<string, string>()

  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => Array.from(jar.entries()).map(([name, value]) => ({ name, value })),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => jar.set(name, value))
      },
    },
  })

  const email = `middleware-test-${Date.now()}@example.com`
  const { error } = await client.auth.signUp({ email, password: 'password123' })
  if (error) throw error

  return jar
}

describe('auth-gating middleware', () => {
  it('redirects an unauthenticated request to a protected route', async () => {
    const request = new NextRequest('http://localhost:3000/dashboard')
    const response = await middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/sign-in')
  })

  it('lets an unauthenticated request through to a public route', async () => {
    const request = new NextRequest('http://localhost:3000/')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('lets an authenticated request through to a protected route', async () => {
    const jar = await signInAndCaptureCookies()
    const request = new NextRequest('http://localhost:3000/dashboard')
    jar.forEach((value, name) => request.cookies.set(name, value))

    const response = await middleware(request)
    expect(response.status).not.toBe(307)
  })
})
