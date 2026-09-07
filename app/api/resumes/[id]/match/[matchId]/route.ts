import type { NextRequest } from 'next/server'
import { getRequestUser } from '@/lib/supabase/route'

// Postgres' error code for a malformed UUID literal, same one
// invalidResumeIdResponse checks — reused directly here (rather than through
// that helper) since its message is hardcoded to "resume id" and a bad
// matchId needs its own wording.
const POSTGRES_INVALID_UUID = '22P02'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; matchId: string }> }) {
  const { matchId } = await params
  const { supabase, user } = await getRequestUser(request)

  if (!user) {
    return Response.json({ error: 'You must be signed in to delete a job match.' }, { status: 401 })
  }

  // RLS-scoped delete (see the "Users can delete their own job matches"
  // policy in supabase/migrations) — no explicit .eq('user_id', ...)
  // filter needed, same convention as DELETE /api/resumes/[id]: another
  // user's match, or one that doesn't exist, matches zero rows either way.
  const { data, error } = await supabase.from('job_matches').delete().eq('id', matchId).select('id').maybeSingle()

  if (error) {
    if (error.code === POSTGRES_INVALID_UUID) {
      return Response.json({ error: 'Invalid match id.' }, { status: 400 })
    }
    console.error('[match] Failed to delete job match:', error.message)
    return Response.json({ error: 'Could not delete this match. Please try again.' }, { status: 500 })
  }

  if (!data) {
    return Response.json({ error: 'Job match not found.' }, { status: 404 })
  }

  return Response.json({ id: data.id })
}
