// Shape of a fully-analyzed resume row, used once we know parsed_data and
// feedback are both present.
export type StoredResume = {
  id: string
  original_filename: string
  created_at: string
  parsed_data: {
    name: string | null
    skills: string[]
    experience: { title: string; company: string; duration: string | null; highlights: string[] }[]
    education: { institution: string; degree: string | null; year: string | null }[]
  }
  feedback: {
    clarity: string
    impact: string
    gaps: string[]
  }
}

// The DB columns are nullable jsonb (see supabase/migrations) — nothing
// stops a row from existing without them (e.g. inserted outside the upload
// route). This is the honest shape of what a raw query actually returns;
// narrow it to StoredResume with isCompleteResume before rendering fields
// that assume both are present.
export type RawResumeRow = Omit<StoredResume, 'parsed_data' | 'feedback'> & {
  parsed_data: StoredResume['parsed_data'] | null
  feedback: StoredResume['feedback'] | null
}

export function isCompleteResume(row: RawResumeRow): row is StoredResume {
  return row.parsed_data !== null && row.feedback !== null
}
