import { toJSONSchema } from 'zod'
import { resumeAnalysisSchema, type ResumeAnalysis } from './schema'
import type { OllamaConfig } from '@/lib/ollama/client'

export class ResumeAnalysisError extends Error {}

const SYSTEM_PROMPT =
  'You are a resume reviewer. Extract the structured fields from the resume text below, and ' +
  'give concise, specific feedback on its clarity, impact, and gaps. Respond with JSON only.'

const RESPONSE_SCHEMA = toJSONSchema(resumeAnalysisSchema)

// A single structured-output call to a local Ollama model produces both the
// parsed fields and the feedback together, so they can never end up
// describing two different readings of the resume. Uses Ollama's native
// /api/chat endpoint (not the OpenAI-compatible shim) since its `format`
// field for JSON-schema-constrained output is the more stable, longer-
// documented surface.
export async function analyzeResume(resumeText: string, config: OllamaConfig): Promise<ResumeAnalysis> {
  let response: Response
  try {
    response = await fetch(`${config.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: resumeText },
        ],
        format: RESPONSE_SCHEMA,
        stream: false,
      }),
    })
  } catch (err) {
    throw new ResumeAnalysisError(`Could not reach Ollama at ${config.baseUrl}: ${(err as Error).message}`)
  }

  if (!response.ok) {
    throw new ResumeAnalysisError(`Ollama returned ${response.status}: ${await response.text()}`)
  }

  const data = (await response.json()) as { message?: { content?: string } }
  const content = data.message?.content
  if (!content) {
    throw new ResumeAnalysisError('Ollama did not return a response.')
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(content)
  } catch {
    throw new ResumeAnalysisError('Ollama returned a response that was not valid JSON.')
  }

  const result = resumeAnalysisSchema.safeParse(parsedJson)
  if (!result.success) {
    throw new ResumeAnalysisError('Ollama returned data that did not match the expected schema.')
  }

  return result.data
}
