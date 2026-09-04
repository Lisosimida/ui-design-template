import { GoogleGenAI } from '@google/genai'
import { toJSONSchema } from 'zod'
import { resumeAnalysisSchema, type ResumeAnalysis } from './schema'

export class ResumeAnalysisError extends Error {}

const SYSTEM_PROMPT =
  'You are a resume reviewer. Extract the structured fields from the resume text below, and ' +
  'give concise, specific feedback on its clarity, impact, and gaps.'

const RESPONSE_SCHEMA = toJSONSchema(resumeAnalysisSchema)

export interface GeminiConfig {
  apiKey: string
  model: string
}

// A single structured-output call produces both the parsed fields and the
// feedback together, so they can never end up describing two different
// readings of the resume. The client is constructed inside the function
// (not at module scope) so tests can mock the `@google/genai` export and
// intercept it, the same seam the Claude/Anthropic SDK used before this.
export async function analyzeResume(resumeText: string, config: GeminiConfig): Promise<ResumeAnalysis> {
  const client = new GoogleGenAI({ apiKey: config.apiKey })

  let response
  try {
    response = await client.models.generateContent({
      model: config.model,
      contents: resumeText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_SCHEMA,
      },
    })
  } catch (err) {
    throw new ResumeAnalysisError(`Gemini request failed: ${(err as Error).message}`)
  }

  const text = response.text
  if (!text) {
    throw new ResumeAnalysisError('Gemini did not return a response.')
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(text)
  } catch {
    throw new ResumeAnalysisError('Gemini returned a response that was not valid JSON.')
  }

  const result = resumeAnalysisSchema.safeParse(parsedJson)
  if (!result.success) {
    throw new ResumeAnalysisError('Gemini returned data that did not match the expected schema.')
  }

  return result.data
}
