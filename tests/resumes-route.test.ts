import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const OLLAMA_BASE_URL = 'http://ollama-test.local:11434'
process.env.OLLAMA_BASE_URL = OLLAMA_BASE_URL
process.env.OLLAMA_MODEL = 'test-model'

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

// Only the Ollama HTTP call is stubbed — everything else (auth, file
// parsing, the RLS-protected insert) runs for real against the test
// Supabase project, per the spec's "primary seam" for this ticket. Calls to
// anything other than OLLAMA_BASE_URL (i.e. Supabase's own fetches) pass
// through to the real fetch untouched.
const realFetch = globalThis.fetch
let ollamaCallCount = 0
let ollamaHandler: () => Response | Promise<Response> = () =>
  Response.json({ message: { content: JSON.stringify(FIXTURE_ANALYSIS) } })

vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
  const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  if (!requestUrl.startsWith(OLLAMA_BASE_URL)) return realFetch(input, init)
  ollamaCallCount += 1
  return ollamaHandler()
})

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
    ollamaCallCount = 0
    ollamaHandler = () => Response.json({ message: { content: JSON.stringify(FIXTURE_ANALYSIS) } })
  })

  it('rejects an unauthenticated request', async () => {
    const formData = new FormData()
    formData.append('file', new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' }))
    const request = new NextRequest('http://localhost:3000/api/resumes', { method: 'POST', body: formData })

    const response = await POST(request)

    expect(response.status).toBe(401)
    expect(ollamaCallCount).toBe(0)
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
    expect(ollamaCallCount).toBe(1)

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

  it('rejects an unsupported file type with 400 and never calls Ollama', async () => {
    const { jar } = await signInAndCaptureCookies()
    const file = new File([Buffer.from('just some text')], 'resume.txt', { type: 'text/plain' })
    const request = buildRequest(jar, file)

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error).toMatch(/unsupported file type/i)
    expect(ollamaCallCount).toBe(0)
  })

  it('returns 502 when Ollama is unreachable, without saving a row', async () => {
    ollamaHandler = () => {
      throw new Error('connect ECONNREFUSED')
    }
    const { jar, client } = await signInAndCaptureCookies()
    const file = new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' })
    const request = buildRequest(jar, file)

    const response = await POST(request)
    expect(response.status).toBe(502)

    const { data: rows } = await client.from('resumes').select()
    expect(rows).toHaveLength(0)
  })

  it('returns 502 when Ollama returns data that fails schema validation', async () => {
    ollamaHandler = () => Response.json({ message: { content: JSON.stringify({ not: 'valid' }) } })
    const { jar } = await signInAndCaptureCookies()
    const file = new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' })
    const request = buildRequest(jar, file)

    const response = await POST(request)
    expect(response.status).toBe(502)
  })
})
