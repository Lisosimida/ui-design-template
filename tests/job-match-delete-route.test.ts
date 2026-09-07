import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const { DELETE } = await import('../app/api/resumes/[id]/match/[matchId]/route')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Same cookie-jar-via-@supabase/ssr sign-in pattern as
// tests/resume-delete-route.test.ts / tests/job-match-route.test.ts.
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

  const email = `job-match-delete-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  const { data, error } = await client.auth.signUp({ email, password: 'password123' })
  if (error) throw error

  return { jar, userId: data.user!.id, client }
}

async function insertResume(client: SupabaseClient, userId: string): Promise<string> {
  const { data, error } = await client
    .from('resumes')
    .insert({ user_id: userId, original_filename: 'resume.pdf', extracted_text: 'Jane Doe, Senior Engineer...' })
    .select()
    .single()
  if (error) throw error
  return data.id
}

// Inserts a job_matches row directly — bypasses the match route/Gemini
// entirely, since delete only needs a row to exist, matching how
// tests/resume-delete-route.test.ts inserts resumes directly for the same
// reason.
async function insertJobMatch(client: SupabaseClient, userId: string, resumeId: string): Promise<string> {
  const { data, error } = await client
    .from('job_matches')
    .insert({
      user_id: userId,
      resume_id: resumeId,
      job_description: 'We need a senior TypeScript engineer.',
      fit_score: 72,
      summary: 'Solid overlap on core engineering skills.',
    })
    .select()
    .single()
  if (error) throw error
  return data.id
}

function buildDeleteRequest(jar: Map<string, string>, resumeId: string, matchId: string) {
  const request = new NextRequest(`http://localhost:3000/api/resumes/${resumeId}/match/${matchId}`, {
    method: 'DELETE',
  })
  jar.forEach((value, name) => request.cookies.set(name, value))
  return request
}

describe('DELETE /api/resumes/[id]/match/[matchId]', () => {
  it('rejects an unauthenticated request', async () => {
    const request = buildDeleteRequest(
      new Map(),
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000'
    )
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'irrelevant', matchId: 'irrelevant' }),
    })
    expect(response.status).toBe(401)
  })

  it("deletes the signed-in user's own job match", async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId)
    const matchId = await insertJobMatch(client, userId, resumeId)

    const request = buildDeleteRequest(jar, resumeId, matchId)
    const response = await DELETE(request, { params: Promise.resolve({ id: resumeId, matchId }) })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.id).toBe(matchId)

    // Persisted removal, not just a 200 — re-query directly rather than
    // trusting the response, same convention as resume-delete-route.test.ts.
    const { data } = await client.from('job_matches').select().eq('id', matchId)
    expect(data).toHaveLength(0)
  })

  it("returns 404 and does not delete another user's job match", async () => {
    const owner = await signInAndCaptureCookies()
    const resumeId = await insertResume(owner.client, owner.userId)
    const matchId = await insertJobMatch(owner.client, owner.userId, resumeId)

    const attacker = await signInAndCaptureCookies()
    const request = buildDeleteRequest(attacker.jar, resumeId, matchId)
    const response = await DELETE(request, { params: Promise.resolve({ id: resumeId, matchId }) })

    expect(response.status).toBe(404)

    const { data } = await owner.client.from('job_matches').select().eq('id', matchId)
    expect(data).toHaveLength(1)
  })

  it('returns 400 for a malformed match id', async () => {
    const { jar } = await signInAndCaptureCookies()
    const request = buildDeleteRequest(jar, '00000000-0000-0000-0000-000000000000', 'not-a-uuid')
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000000', matchId: 'not-a-uuid' }),
    })
    expect(response.status).toBe(400)
  })

  it('returns 404 for a well-formed match id that does not exist', async () => {
    const { jar } = await signInAndCaptureCookies()
    const request = buildDeleteRequest(
      jar,
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000'
    )
    const response = await DELETE(request, {
      params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000000', matchId: '00000000-0000-0000-0000-000000000000' }),
    })
    expect(response.status).toBe(404)
  })
})
