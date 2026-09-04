import { z } from 'zod'

// One Claude call produces both the structured resume data and the written
// feedback (see analyze.ts) — a single schema keeps that atomic instead of
// two round trips that could disagree with each other.
export const resumeAnalysisSchema = z.object({
  name: z.string().nullable(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string().nullable(),
      highlights: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().nullable(),
      year: z.string().nullable(),
    })
  ),
  feedback: z.object({
    clarity: z.string(),
    impact: z.string(),
    gaps: z.array(z.string()),
  }),
})

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>
