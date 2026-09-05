import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const mockGenerateContent = vi.fn()

// Only the Gemini call is stubbed — auth, the RLS-scoped resume lookup, and
// input validation all run for real, same seam as tests/resumes-route.test.ts.
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = { generateContent: mockGenerateContent }
  },
}))

process.env.GEMINI_API_KEY = 'test-gemini-key'

const { POST } = await import('../app/api/resumes/[id]/match/route')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const FIXTURE_MATCH = {
  fitScore: 72,
  summary: 'Solid overlap on core engineering skills, light on leadership experience the posting asks for.',
  strengths: ['Strong TypeScript/React background matches the stack requirements.'],
  gaps: ['No people-management experience mentioned, which the posting lists as required.'],
  recommendations: ['Add any mentoring or lead-engineer responsibilities from past roles, if applicable.'],
}

// Same cookie-jar-via-@supabase/ssr sign-in pattern as
// tests/resume-delete-route.test.ts. The returned `client` stays
// authenticated as this user, so it can insert a resume on their behalf too.
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

  const email = `job-match-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  const { data, error } = await client.auth.signUp({ email, password: 'password123' })
  if (error) throw error

  return { jar, userId: data.user!.id, client }
}

async function insertResume(
  client: SupabaseClient,
  userId: string,
  overrides: { extracted_text?: string | null } = {}
): Promise<string> {
  const { data, error } = await client
    .from('resumes')
    .insert({
      user_id: userId,
      original_filename: 'resume.pdf',
      extracted_text: 'extracted_text' in overrides ? overrides.extracted_text : 'Jane Doe, Senior Engineer...',
    })
    .select()
    .single()
  if (error) throw error
  return data.id
}

function buildMatchRequest(jar: Map<string, string>, resumeId: string, body?: unknown) {
  const request = new NextRequest(`http://localhost:3000/api/resumes/${resumeId}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  jar.forEach((value, name) => request.cookies.set(name, value))
  return request
}

describe('POST /api/resumes/[id]/match', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset()
    mockGenerateContent.mockResolvedValue({ text: JSON.stringify(FIXTURE_MATCH) })
  })

  it('rejects an unauthenticated request', async () => {
    const request = buildMatchRequest(new Map(), '00000000-0000-0000-0000-000000000000', {
      jobDescription: 'We need a senior engineer.',
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'irrelevant' }) })
    expect(response.status).toBe(401)
    expect(mockGenerateContent).not.toHaveBeenCalled()
  })

  it('matches the resume against a pasted job description', async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId)

    const request = buildMatchRequest(jar, resumeId, { jobDescription: 'We need a senior TypeScript engineer.' })
    const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual(FIXTURE_MATCH)
    expect(mockGenerateContent).toHaveBeenCalledTimes(1)

    const [[callArgs]] = mockGenerateContent.mock.calls
    expect(callArgs.contents).toContain('We need a senior TypeScript engineer.')
    expect(callArgs.contents).toContain('Jane Doe, Senior Engineer...')
  })

  it('rejects a missing job description with 400', async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId)

    const request = buildMatchRequest(jar, resumeId, {})
    const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })
    expect(response.status).toBe(400)
    expect(mockGenerateContent).not.toHaveBeenCalled()
  })

  it('rejects a job description over the length limit with 400', async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId)

    const request = buildMatchRequest(jar, resumeId, { jobDescription: 'x'.repeat(20_001) })
    const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })
    expect(response.status).toBe(400)
    expect(mockGenerateContent).not.toHaveBeenCalled()
  })

  it("returns 404 and does not call Gemini for another user's resume", async () => {
    const owner = await signInAndCaptureCookies()
    const resumeId = await insertResume(owner.client, owner.userId)

    const attacker = await signInAndCaptureCookies()
    const request = buildMatchRequest(attacker.jar, resumeId, { jobDescription: 'We need an engineer.' })
    const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })

    expect(response.status).toBe(404)
    expect(mockGenerateContent).not.toHaveBeenCalled()
  })

  it('returns 404 for a resume with no extracted text', async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId, { extracted_text: null })

    const request = buildMatchRequest(jar, resumeId, { jobDescription: 'We need an engineer.' })
    const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })
    expect(response.status).toBe(404)
  })

  it('returns 400 for a malformed resume id', async () => {
    const { jar } = await signInAndCaptureCookies()
    const request = buildMatchRequest(jar, 'not-a-uuid', { jobDescription: 'We need an engineer.' })
    const response = await POST(request, { params: Promise.resolve({ id: 'not-a-uuid' }) })
    expect(response.status).toBe(400)
  })

  it('returns 502 when the Gemini call fails', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error('upstream failure'))
    const { jar, userId, client } = await signInAndCaptureCookies()
    const resumeId = await insertResume(client, userId)

    const request = buildMatchRequest(jar, resumeId, { jobDescription: 'We need an engineer.' })
    const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })
    expect(response.status).toBe(502)
  })

  it('returns 503 when no Gemini API key is configured', async () => {
    const previousKey = process.env.GEMINI_API_KEY
    delete process.env.GEMINI_API_KEY

    try {
      const { jar, userId, client } = await signInAndCaptureCookies()
      const resumeId = await insertResume(client, userId)

      const request = buildMatchRequest(jar, resumeId, { jobDescription: 'We need an engineer.' })
      const response = await POST(request, { params: Promise.resolve({ id: resumeId }) })
      expect(response.status).toBe(503)
      expect(mockGenerateContent).not.toHaveBeenCalled()
    } finally {
      process.env.GEMINI_API_KEY = previousKey
    }
  })
})
