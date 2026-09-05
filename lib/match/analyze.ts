import { generateStructured, GeminiGenerationError, type GeminiConfig } from '@/lib/gemini/generate'
import { jobMatchSchema, type JobMatch } from './schema'

export class JobMatchError extends GeminiGenerationError {}

const SYSTEM_PROMPT =
  'You compare a resume against a job description and produce a fit assessment. Give a fitScore ' +
  'from 0-100, a one-paragraph summary, the strengths the resume shows for this specific posting, ' +
  "the gaps or weaknesses relative to it, and concrete recommendations to close them. Base every " +
  'claim only on what is actually in the resume and job description — do not invent experience.'

// Computed at request time from the resume's already-extracted text and the
// pasted job description — no embeddings, no stored index, nothing
// persisted beyond this one response (see ticket #7's explicit "no
// persistent vector store" constraint).
export async function matchResumeToJob(
  resumeText: string,
  jobDescription: string,
  config: GeminiConfig
): Promise<JobMatch> {
  const input = `Resume:\n${resumeText}\n\nJob description:\n${jobDescription}`
  return generateStructured(input, SYSTEM_PROMPT, jobMatchSchema, config, JobMatchError)
}
