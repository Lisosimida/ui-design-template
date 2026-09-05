import type { NextRequest } from 'next/server'
import { getRequestUser, invalidResumeIdResponse } from '@/lib/supabase/route'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user } = await getRequestUser(request)

  if (!user) {
    return Response.json({ error: 'You must be signed in to delete a resume.' }, { status: 401 })
  }

  // No explicit .eq('user_id', ...) filter — RLS (see supabase/migrations)
  // is the actual boundary here, the same seam tests/rls.test.ts verifies
  // directly: deleting a resume you don't own matches zero rows rather than
  // erroring, which is exactly what the `!data` branch below turns into 404.
  const { data, error } = await supabase.from('resumes').delete().eq('id', id).select('id').maybeSingle()

  if (error) {
    const invalidIdResponse = invalidResumeIdResponse(error)
    if (invalidIdResponse) return invalidIdResponse
    console.error('[resumes] Failed to delete resume:', error.message)
    return Response.json({ error: 'Could not delete this resume. Please try again.' }, { status: 500 })
  }

  if (!data) {
    return Response.json({ error: 'Resume not found.' }, { status: 404 })
  }

  return Response.json({ id: data.id })
}
