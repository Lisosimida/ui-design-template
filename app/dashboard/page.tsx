import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/(auth)/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

      <div className="card mt-10 p-8 text-muted">
        Resume upload is coming soon — this is the auth-gated shell the rest of the product builds on.
      </div>
    </main>
  )
}
