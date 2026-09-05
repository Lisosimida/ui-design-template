import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/(auth)/actions'
import ResumeDashboard from './ResumeDashboard'
import { isCompleteResume, type RawResumeRow } from './types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // RLS scopes this to the signed-in user regardless of the query itself
  // (see supabase/migrations and tests/rls.test.ts) — no .eq('user_id', ...)
  // needed here.
  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, original_filename, parsed_data, feedback, created_at')
    .order('created_at', { ascending: false })

  // parsed_data/feedback are nullable columns — filter out any row missing
  // either rather than assuming every row is fully analyzed (see types.ts).
  const completeResumes = ((resumes ?? []) as RawResumeRow[]).filter(isCompleteResume)

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-fg">Welcome{user?.email ? `, ${user.email}` : ''}</h1>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn-secondary">
            Sign out
          </button>
        </form>
      </div>

      <ResumeDashboard initialResumes={completeResumes} />
    </main>
  )
}
