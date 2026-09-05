import type { NextRequest } from 'next/server'
import { getRequestUser, invalidResumeIdResponse } from '@/lib/supabase/route'
import { getGeminiApiKey, getGeminiModel } from '@/lib/gemini/client'
import { matchResumeToJob } from '@/lib/match/analyze'
import { jobMatchRequestSchema } from '@/lib/match/schema'
import { isJobMatchRateLimited } from '@/lib/match/rate-limit'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user } = await getRequestUser(request)

  if (!user) {
    return Response.json({ error: 'You must be signed in to match a resume.' }, { status: 401 })
  }

  if (await isJobMatchRateLimited(user.id)) {
    return Response.json({ error: 'Too many requests — please wait a moment and try again.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsedBody = jobMatchRequestSchema.safeParse(body)
  if (!parsedBody.success) {
    return Response.json({ error: parsedBody.error.issues[0].message }, { status: 400 })
  }
  const { jobDescription } = parsedBody.data

  // RLS-scoped select, same pattern as the DELETE route: no
  // .eq('user_id', ...) filter needed, and a resume you don't own — or one
  // that doesn't exist — comes back as no row either way (see tests/rls.test.ts).
  const { data: resume, error: fetchError } = await supabase
    .from('resumes')
    .select('extracted_text')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    const invalidIdResponse = invalidResumeIdResponse(fetchError)
    if (invalidIdResponse) return invalidIdResponse
    console.error('[match] Failed to fetch resume:', fetchError.message)
    return Response.json({ error: 'Could not load this resume. Please try again.' }, { status: 500 })
  }

  if (!resume || !resume.extracted_text) {
    return Response.json({ error: 'Resume not found.' }, { status: 404 })
  }

  const [apiKey, model] = await Promise.all([getGeminiApiKey(), getGeminiModel()])
  if (!apiKey) {
    return Response.json({ error: 'Resume matching is not configured yet.' }, { status: 503 })
  }

  let match
  try {
    match = await matchResumeToJob(resume.extracted_text, jobDescription, { apiKey, model })
  } catch (err) {
    console.error('[match] Gemini match failed:', err)
    return Response.json(
      { error: 'Could not compare your resume to this job description. Please try again.' },
      { status: 502 }
    )
  }

  return Response.json(match)
}
