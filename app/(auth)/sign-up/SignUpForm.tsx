'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp, type AuthActionState } from '../actions'

const initialState: AuthActionState = { error: null }

export default function SignUpForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  return (
    <div className="card p-8">
      <span className="eyebrow">Sign up</span>
      <h1 className="mt-4 font-display text-2xl font-bold text-fg">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Upload a resume and get structured feedback in minutes.</p>

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
            minLength={6}
            autoComplete="new-password"
            className="rounded-xl border border-border/15 bg-surface-2 px-4 py-3 text-fg outline-none focus-visible:border-accent"
          />
        </label>

        {state.error && (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary mt-2 disabled:opacity-60">
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-semibold text-fg hover:text-accent">
          Sign in
        </Link>
      </p>
    </div>
  )
}
