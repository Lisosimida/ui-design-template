'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp, type AuthActionState } from '../actions'

const initialState: AuthActionState = { error: null }

export default function SignUpForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signUp, initialState)

  return (
    <div className="rl-card" style={{ padding: 32 }}>
      <div className="rl-eyebrow">Sign up</div>
      <h1 className="rl-display" style={{ margin: '20px 0 0', fontSize: 26, fontWeight: 700 }}>
        Create your account
      </h1>
      <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--rl-muted)', fontWeight: 500 }}>
        Upload a resume and get structured feedback in minutes.
      </p>

      <form action={formAction} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {next && <input type="hidden" name="next" value={next} />}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--rl-muted)' }}>
          Email
          <input type="email" name="email" required autoComplete="email" className="rl-input" />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--rl-muted)' }}>
          Password
          <input type="password" name="password" required minLength={6} autoComplete="new-password" className="rl-input" />
        </label>

        {state.error && (
          <p role="alert" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--rl-danger)' }}>
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="rl-btn rl-btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: 'var(--rl-muted)', fontWeight: 500 }}>
        Already have an account?{' '}
        <Link href="/sign-in" style={{ fontWeight: 700, color: 'var(--rl-blue)' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
