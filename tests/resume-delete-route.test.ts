import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const { DELETE } = await import('../app/api/resumes/[id]/route')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Same cookie-jar-via-@supabase/ssr sign-in pattern as
// tests/resumes-route.test.ts, so the cookies handed to the route are in
// exactly the format it expects. The returned `client` stays authenticated
// as this user (its session isn't just the cookie jar), so it can also
// insert/select rows on that user's behalf directly, RLS-checked.
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

  const email = `resume-delete-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  const { data, error } = await client.auth.signUp({ email, password: 'password123' })
  if (error) throw error

  return { jar, userId: data.user!.id, client }
}

// Inserts a resume row as the given (already-authenticated) user's client
// — bypasses the upload route/Gemini entirely, since delete only needs a
// row to exist, matching tests/rls.test.ts's own setup style.
async function insertResume(client: SupabaseClient, userId: string, filename: string): Promise<string> {
  const { data, error } = await client
    .from('resumes')
    .insert({ user_id: userId, original_filename: filename })
    .select()
    .single()
  if (error) throw error
  return data.id
}

function buildDeleteRequest(jar: Map<string, string>, id: string) {
  const request = new NextRequest(`http://localhost:3000/api/resumes/${id}`, { method: 'DELETE' })
  jar.forEach((value, name) => request.cookies.set(name, value))
  return request
}

describe('DELETE /api/resumes/[id]', () => {
  it('rejects an unauthenticated request', async () => {
    const request = new NextRequest('http://localhost:3000/api/resumes/00000000-0000-0000-0000-000000000000', {
      method: 'DELETE',
    })
    const response = await DELETE(request, { params: Promise.resolve({ id: 'irrelevant' }) })
    expect(response.status).toBe(401)
  })

  it("deletes the signed-in user's own resume", async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId, 'to-delete.pdf')

    const request = buildDeleteRequest(jar, resumeId)
    const response = await DELETE(request, { params: Promise.resolve({ id: resumeId }) })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe(resumeId)

    const { data } = await client.from('resumes').select().eq('id', resumeId)
    expect(data).toHaveLength(0)
  })

  it("returns 404 and does not delete another user's resume", async () => {
    const owner = await signInAndCaptureCookies()
    const resumeId = await insertResume(owner.client, owner.userId, 'not-yours.pdf')

    const attacker = await signInAndCaptureCookies()
    const request = buildDeleteRequest(attacker.jar, resumeId)
    const response = await DELETE(request, { params: Promise.resolve({ id: resumeId }) })

    expect(response.status).toBe(404)

    const { data } = await owner.client.from('resumes').select().eq('id', resumeId)
    expect(data).toHaveLength(1)
  })

  it('returns 400 for a malformed resume id', async () => {
    const { jar } = await signInAndCaptureCookies()
    const request = buildDeleteRequest(jar, 'not-a-uuid')
    const response = await DELETE(request, { params: Promise.resolve({ id: 'not-a-uuid' }) })
    expect(response.status).toBe(400)
  })

  it('returns 404 for a well-formed id that does not exist', async () => {
    const { jar } = await signInAndCaptureCookies()
    const request = buildDeleteRequest(jar, '00000000-0000-0000-0000-000000000000')
    const response = await DELETE(request, { params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000000' }) })
    expect(response.status).toBe(404)
  })
})
