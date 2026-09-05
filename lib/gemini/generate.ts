import { GoogleGenAI } from '@google/genai'
import { toJSONSchema, type ZodType } from 'zod'

export interface GeminiConfig {
  apiKey: string
  model: string
}

export class GeminiGenerationError extends Error {}

// Calls Gemini with a system prompt and a JSON-schema-constrained response,
// validating the result against the given zod schema. Shared by resume
// analysis (lib/resume/analyze.ts) and job matching (lib/match/analyze.ts)
// so both don't hand-roll the same client-construct/parse/validate steps.
// The client is constructed inside the function (not at module scope) so
// tests can mock the `@google/genai` export and intercept it.
//
// Errors are thrown as `ErrorClass` (a GeminiGenerationError subclass the
// caller provides), not the shared base class directly — resume analysis
// and job matching are unrelated failure domains, and a shared class would
// make them indistinguishable to any future error-handling code that wants
// to special-case one.
export async function generateStructured<T>(
  input: string,
  systemPrompt: string,
  schema: ZodType<T>,
  config: GeminiConfig,
  ErrorClass: new (message: string) => GeminiGenerationError = GeminiGenerationError
): Promise<T> {
  const client = new GoogleGenAI({ apiKey: config.apiKey })

  let response
  try {
    response = await client.models.generateContent({
      model: config.model,
      contents: input,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseJsonSchema: toJSONSchema(schema),
      },
    })
  } catch (err) {
    throw new ErrorClass(`Gemini request failed: ${(err as Error).message}`)
  }

  const text = response.text
  if (!text) {
    throw new ErrorClass('Gemini did not return a response.')
  }

  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(text)
  } catch {
    throw new ErrorClass('Gemini returned a response that was not valid JSON.')
  }

  const result = schema.safeParse(parsedJson)
  if (!result.success) {
    throw new ErrorClass('Gemini returned data that did not match the expected schema.')
  }

  return result.data
}
