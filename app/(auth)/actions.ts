'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthActionState = { error: string | null }

function safeNextPath(formData: FormData): string {
  const next = formData.get('next')
  // Only ever redirect within the app — an absolute/external `next` value
  // would make this an open redirect.
  return typeof next === 'string' && next.startsWith('/') ? next : '/dashboard'
}

export async function signUp(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  // No session back means either email confirmation is required, or (by
  // design, to avoid leaking which emails are registered) this email
  // already has an account — Supabase makes those two cases
  // indistinguishable on purpose, so we can't message more precisely.
  if (!data.session) {
    return { error: 'Check your email to confirm your account, or sign in if you already have one.' }
  }

  redirect(safeNextPath(formData))
}

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect(safeNextPath(formData))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
