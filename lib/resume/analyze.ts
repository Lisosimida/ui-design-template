import { generateStructured, GeminiGenerationError, type GeminiConfig } from '@/lib/gemini/generate'
import { resumeAnalysisSchema, type ResumeAnalysis } from './schema'

export class ResumeAnalysisError extends GeminiGenerationError {}
export type { GeminiConfig }

const SYSTEM_PROMPT =
  'You are a resume reviewer. Extract the structured fields from the resume text below, and ' +
  'give concise, specific feedback on its clarity, impact, and gaps.'

// A single structured-output call produces both the parsed fields and the
// feedback together, so they can never end up describing two different
// readings of the resume.
export async function analyzeResume(resumeText: string, config: GeminiConfig): Promise<ResumeAnalysis> {
  return generateStructured(resumeText, SYSTEM_PROMPT, resumeAnalysisSchema, config, ResumeAnalysisError)
}
