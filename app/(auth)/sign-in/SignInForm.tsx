'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signIn, type AuthActionState } from '../actions'

const initialState: AuthActionState = { error: null }

export default function SignInForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  return (
    <div className="card p-8">
      <span className="eyebrow">Sign in</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-fg">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Sign in to see your parsed resumes and feedback.</p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}
        <label className="flex flex-col gap-1 text-sm text-muted">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-xl border border-border/15 bg-surface-2 px-4 py-3 text-fg outline-none focus-visible:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="rounded-xl border border-border/15 bg-surface-2 px-4 py-3 text-fg outline-none focus-visible:border-accent"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary mt-2 disabled:opacity-60">
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link href="/sign-up" className="font-semibold text-fg hover:text-accent">
          Create an account
        </Link>
      </p>
    </div>
  )
}
