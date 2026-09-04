import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const mockParse = vi.fn()

// The Claude API call is the only thing stubbed here — everything else
// (auth, file parsing, the RLS-protected insert) runs for real against the
// test Supabase project, per the spec's "primary seam" for this ticket.
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { parse: mockParse }
  },
}))

process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'

const { POST } = await import('../app/api/resumes/route')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const FIXTURE_ANALYSIS = {
  name: 'Jane Doe',
  skills: ['TypeScript', 'React', 'Node.js'],
  experience: [
    { title: 'Senior Software Engineer', company: 'Acme Corp', duration: '2020-2024', highlights: [] },
  ],
  education: [{ institution: 'State University', degree: 'BS Computer Science', year: '2016-2020' }],
  feedback: { clarity: 'Clear and well organized.', impact: 'Strong, quantified impact.', gaps: [] },
}

// Same cookie-jar-via-@supabase/ssr sign-in pattern as proxy.test.ts, so the
// cookies handed to the route are in exactly the format it expects.
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

  const email = `resumes-test-${Date.now()}@example.com`
  const { data, error } = await client.auth.signUp({ email, password: 'password123' })
  if (error) throw error

  return { jar, userId: data.user!.id, client }
}

function buildRequest(jar: Map<string, string>, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const request = new NextRequest('http://localhost:3000/api/resumes', { method: 'POST', body: formData })
  jar.forEach((value, name) => request.cookies.set(name, value))
  return request
}

function readFixture(name: string) {
  return readFileSync(path.resolve(import.meta.dirname, 'fixtures', name))
}

describe('POST /api/resumes', () => {
  beforeEach(() => {
    mockParse.mockReset()
    mockParse.mockResolvedValue({ parsed_output: FIXTURE_ANALYSIS })
  })

  it('rejects an unauthenticated request', async () => {
    const formData = new FormData()
    formData.append('file', new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' }))
    const request = new NextRequest('http://localhost:3000/api/resumes', { method: 'POST', body: formData })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(mockParse).not.toHaveBeenCalled()
  })

  it('parses a real PDF fixture, persists it under the uploading user, and returns the structured result', async () => {
    const { jar, userId, client } = await signInAndCaptureCookies()
    const file = new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' })
    const request = buildRequest(jar, file)

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.original_filename).toBe('resume.pdf')
    expect(body.parsed_data.skills).toEqual(FIXTURE_ANALYSIS.skills)
    expect(body.parsed_data.experience).toEqual(FIXTURE_ANALYSIS.experience)
    expect(body.feedback).toEqual(FIXTURE_ANALYSIS.feedback)
    expect(mockParse).toHaveBeenCalledTimes(1)

    const { data: rows, error } = await client.from('resumes').select().eq('id', body.id)
    expect(error).toBeNull()
    expect(rows).toHaveLength(1)
    expect(rows![0].user_id).toBe(userId)
    expect(rows![0].original_filename).toBe('resume.pdf')
    expect(rows![0].parsed_data).toEqual({
      name: FIXTURE_ANALYSIS.name,
      skills: FIXTURE_ANALYSIS.skills,
      experience: FIXTURE_ANALYSIS.experience,
      education: FIXTURE_ANALYSIS.education,
    })
    expect(rows![0].feedback).toEqual(FIXTURE_ANALYSIS.feedback)
  })

  it('rejects an unsupported file type with 400 and never calls Claude', async () => {
    const { jar } = await signInAndCaptureCookies()
    const file = new File([Buffer.from('just some text')], 'resume.txt', { type: 'text/plain' })
    const request = buildRequest(jar, file)

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toMatch(/unsupported file type/i)
    expect(mockParse).not.toHaveBeenCalled()
  })

  it('returns 502 when the Claude call fails, without saving a row', async () => {
    mockParse.mockRejectedValueOnce(new Error('upstream failure'))
    const { jar, client } = await signInAndCaptureCookies()
    const file = new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' })
    const request = buildRequest(jar, file)

    const response = await POST(request)
    expect(response.status).toBe(502)

    const { data: rows } = await client.from('resumes').select()
    expect(rows).toHaveLength(0)
  })

  it('returns 503 when no Claude API key is configured', async () => {
    const previousKey = process.env.ANTHROPIC_API_KEY
    delete process.env.ANTHROPIC_API_KEY

    try {
      const { jar } = await signInAndCaptureCookies()
      const file = new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' })
      const request = buildRequest(jar, file)

      const response = await POST(request)
      expect(response.status).toBe(503)
      expect(mockParse).not.toHaveBeenCalled()
    } finally {
      process.env.ANTHROPIC_API_KEY = previousKey
    }
  })
})
