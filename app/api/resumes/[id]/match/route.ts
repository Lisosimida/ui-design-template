import type { NextRequest } from 'next/server'
import { getRequestUser, invalidResumeIdResponse } from '@/lib/supabase/route'
import { getGeminiApiKey, getGeminiModel } from '@/lib/gemini/client'
import { matchResumeToJob } from '@/lib/match/analyze'
import { jobMatchSchema, jobMatchRequestSchema, type StoredJobMatch } from '@/lib/match/schema'
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

  // Persisted so "Past matches" survives a refresh instead of losing the
  // result the moment the user navigates away — same "computed but not
  // saved is still a failure" stance as the resumes upload route.
  const { data: saved, error: insertError } = await supabase
    .from('job_matches')
    .insert({
      resume_id: id,
      user_id: user.id,
      job_description: jobDescription,
      fit_score: match.fitScore,
      summary: match.summary,
      strengths: match.strengths,
      gaps: match.gaps,
      recommendations: match.recommendations,
    })
    .select()
    .single()

  if (insertError) {
    console.error('[match] Failed to save job match:', insertError.message)
    return Response.json(
      { error: 'Your match was computed but could not be saved. Please try again.' },
      { status: 500 }
    )
  }

  let stored: StoredJobMatch
  try {
    stored = toStoredJobMatch(saved)
  } catch (err) {
    console.error('[match] Saved job match failed to parse:', err)
    return Response.json({ error: 'Your match was saved but could not be loaded. Please try again.' }, { status: 500 })
  }

  return Response.json(stored)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user } = await getRequestUser(request)

  if (!user) {
    return Response.json({ error: 'You must be signed in to view job matches.' }, { status: 401 })
  }

  // No explicit .eq('user_id', ...) or ownership check on the resume itself
  // — RLS scopes job_matches to auth.uid() = user_id the same way resumes
  // is scoped (see supabase/migrations and tests/rls.test.ts), so a
  // resume_id that isn't this user's own comes back as an empty list either
  // way, matching the DELETE/match-POST convention elsewhere in this file.
  const { data, error } = await supabase
    .from('job_matches')
    .select('id, resume_id, job_description, fit_score, summary, strengths, gaps, recommendations, created_at')
    .eq('resume_id', id)
    .order('created_at', { ascending: false })

  if (error) {
    const invalidIdResponse = invalidResumeIdResponse(error)
    if (invalidIdResponse) return invalidIdResponse
    console.error('[match] Failed to list job matches:', error.message)
    return Response.json({ error: 'Could not load past matches. Please try again.' }, { status: 500 })
  }

  let stored: StoredJobMatch[]
  try {
    stored = data.map(toStoredJobMatch)
  } catch (err) {
    console.error('[match] Stored job match failed to parse:', err)
    return Response.json({ error: 'Could not load past matches. Please try again.' }, { status: 500 })
  }

  return Response.json(stored)
}

// The raw shape a job_matches row comes back as (snake_case DB columns,
// jsonb array columns untyped at the client boundary).
type JobMatchRow = {
  id: string
  job_description: string
  fit_score: number
  summary: string
  strengths: unknown
  gaps: unknown
  recommendations: unknown
  created_at: string
}

// Maps a job_matches row to the camelCase shape the client already consumes
// (JobMatch's fitScore/etc.), so JobMatchForm reads one consistent shape
// whether a match just ran or came from history. Re-validates the jsonb
// columns through jobMatchSchema rather than casting — the same schema
// already describes this exact shape (it's what Gemini's output was
// checked against before the row was written), so a corrupted or
// hand-edited row is caught here instead of handed to the client silently
// mistyped.
function toStoredJobMatch(row: JobMatchRow): StoredJobMatch {
  const parsed = jobMatchSchema.parse({
    fitScore: row.fit_score,
    summary: row.summary,
    strengths: row.strengths,
    gaps: row.gaps,
    recommendations: row.recommendations,
  })
  return {
    ...parsed,
    id: row.id,
    jobDescription: row.job_description,
    createdAt: row.created_at,
  }
}
