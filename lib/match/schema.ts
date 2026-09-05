import { z } from 'zod'

// One structured-output call scores fit and explains it together, so the
// score and the reasoning behind it can't drift apart the way a separate
// embeddings-similarity number and an unrelated LLM explanation could.
export const jobMatchSchema = z.object({
  fitScore: z.number().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export type JobMatch = z.infer<typeof jobMatchSchema>

// Validates the POST /api/resumes/[id]/match request body — same tool
// (zod) already used for the Gemini response schemas above and elsewhere
// in this codebase, instead of hand-rolled typeof/in checks.
export const jobMatchRequestSchema = z.object({
  jobDescription: z.string().trim().min(1, 'A job description is required.').max(20_000, 'Job description is too long.'),
})
