import type { NextRequest } from 'next/server'
import { createRouteClient } from '@/lib/supabase/route'
import { getGeminiApiKey, getGeminiModel } from '@/lib/gemini/client'
import { analyzeResume } from '@/lib/resume/analyze'
import { extractResumeText, InvalidResumeFileError, CorruptResumeFileError } from '@/lib/resume/extract-text'
import { isResumeUploadRateLimited } from '@/lib/resume/rate-limit'
import { captureServerEvent } from '@/lib/posthog/server'
import { runInBackground } from '@/lib/cloudflare/background'

export async function POST(request: NextRequest) {
  const supabase = createRouteClient(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'You must be signed in to upload a resume.' }, { status: 401 })
  }

  if (await isResumeUploadRateLimited(user.id)) {
    return Response.json({ error: 'Too many uploads — please wait a moment and try again.' }, { status: 429 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return Response.json({ error: 'A resume file is required.' }, { status: 400 })
  }

  let resumeText: string
  try {
    resumeText = await extractResumeText(file)
  } catch (err) {
    if (err instanceof InvalidResumeFileError || err instanceof CorruptResumeFileError) {
      return Response.json({ error: err.message }, { status: 400 })
    }
    throw err
  }

  const apiKey = await getGeminiApiKey()
  if (!apiKey) {
    return Response.json({ error: 'Resume analysis is not configured yet.' }, { status: 503 })
  }

  let analysis
  try {
    analysis = await analyzeResume(resumeText, { apiKey, model: await getGeminiModel() })
  } catch (err) {
    console.error('[resumes] Gemini analysis failed:', err)
    return Response.json({ error: 'Could not analyze your resume. Please try again.' }, { status: 502 })
  }

  const { name, skills, experience, education, feedback } = analysis

  const { data: resume, error: dbError } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      original_filename: file.name,
      extracted_text: resumeText,
      parsed_data: { name, skills, experience, education },
      feedback,
    })
    .select()
    .single()

  if (dbError) {
    console.error('[resumes] Failed to save resume:', dbError.message)
    return Response.json(
      { error: 'Your resume was analyzed but could not be saved. Please try again.' },
      { status: 500 }
    )
  }

  // Fire-and-forget via ctx.waitUntil — the upload already succeeded, so the
  // response shouldn't wait on an analytics round trip (see lib/cloudflare/background.ts).
  await runInBackground(() => captureServerEvent(user.id, 'resume_uploaded', { resume_id: resume.id }))

  return Response.json({
    id: resume.id,
    original_filename: resume.original_filename,
    parsed_data: resume.parsed_data,
    feedback: resume.feedback,
    created_at: resume.created_at,
  })
}
