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
    <main className="resume-lab rl-page" style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="rl-eyebrow">Dashboard</div>
            <h1 className="rl-display" style={{ margin: '16px 0 0', fontSize: 28, fontWeight: 700 }}>
              Welcome{user?.email ? `, ${user.email}` : ''}
            </h1>
          </div>
          <form action={signOut}>
            <button type="submit" className="rl-btn rl-btn-outline" style={{ border: '2.5px solid var(--rl-ink)', padding: '10px 20px', fontSize: 13 }}>
              Sign out
            </button>
          </form>
        </div>

        <ResumeDashboard initialResumes={completeResumes} />
      </div>
    </main>
  )
}
