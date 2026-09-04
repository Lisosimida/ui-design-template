import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { resumeAnalysisSchema, type ResumeAnalysis } from './schema'

export class ResumeAnalysisError extends Error {}

const SYSTEM_PROMPT =
  'You are a resume reviewer. Extract the structured fields from the resume text below, and ' +
  'give concise, specific feedback on its clarity, impact, and gaps.'

// A single structured-output call produces both the parsed fields and the
// feedback together, so they can never end up describing two different
// readings of the resume.
export async function analyzeResume(resumeText: string, apiKey: string): Promise<ResumeAnalysis> {
  const client = new Anthropic({ apiKey })

  const response = await client.messages.parse({
    model: 'claude-opus-5',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: resumeText }],
    output_config: {
      format: zodOutputFormat(resumeAnalysisSchema),
    },
  })

  if (!response.parsed_output) {
    throw new ResumeAnalysisError('Claude did not return structured output for this resume.')
  }

  return response.parsed_output
}
