import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function createTestUser(email: string, password: string): Promise<SupabaseClient> {
  const client = createClient(url, anonKey)
  const { error } = await client.auth.signUp({ email, password })
  if (error) throw error
  return client
}

// Tested directly against Postgres/Supabase Auth, not through the app — RLS
// is the real security boundary (build brief section 4), so it's verified
// for real here rather than assumed from application-level checks.
describe('resumes RLS policies', () => {
  let userAClient: SupabaseClient
  let userBClient: SupabaseClient
  let userAId: string
  let resumeId: string

  beforeAll(async () => {
    const suffix = Date.now()
    userAClient = await createTestUser(`rls-user-a-${suffix}@example.com`, 'password123')
    userBClient = await createTestUser(`rls-user-b-${suffix}@example.com`, 'password123')

    const {
      data: { user },
    } = await userAClient.auth.getUser()
    userAId = user!.id

    const { data, error } = await userAClient
      .from('resumes')
      .insert({ user_id: userAId, original_filename: 'resume.pdf' })
      .select()
      .single()

    if (error) throw error
    resumeId = data.id
  })

  it('lets a user select their own resume', async () => {
    const { data, error } = await userAClient.from('resumes').select().eq('id', resumeId)
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
  })

  it("never returns another user's resume on select", async () => {
    const { data, error } = await userBClient.from('resumes').select().eq('id', resumeId)
    expect(error).toBeNull()
    expect(data).toHaveLength(0)
  })

  it("rejects inserting a resume under another user's id", async () => {
    const { error } = await userBClient.from('resumes').insert({ user_id: userAId, original_filename: 'x.pdf' })
    expect(error).not.toBeNull()
  })

  it("never lets another user delete a resume they don't own", async () => {
    // RLS filters the delete to zero matching rows rather than erroring.
    const { error } = await userBClient.from('resumes').delete().eq('id', resumeId)
    expect(error).toBeNull()

    const { data } = await userAClient.from('resumes').select().eq('id', resumeId)
    expect(data).toHaveLength(1)
  })
})
