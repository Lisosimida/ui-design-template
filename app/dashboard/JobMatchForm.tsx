'use client'

import { useEffect, useState, type FormEvent } from 'react'
import type { StoredResume } from './types'
import type { StoredJobMatch } from '@/lib/match/schema'
import { fetchJson } from './fetch-json'

export default function JobMatchForm({ resumes }: { resumes: StoredResume[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<StoredJobMatch[]>([])

  // Pins the selection to a specific resume once one exists, instead of
  // re-deriving "resumes[0]" on every render — the latter silently swapped
  // the effective selection to whatever the user had most recently uploaded
  // (new uploads are unshifted to the front in ResumeDashboard), changing
  // what Compare would run against without the user touching the dropdown.
  // Still falls back to the first resume if the pinned one gets deleted.
  useEffect(() => {
    if (selectedId !== null && resumes.some((resume) => resume.id === selectedId)) return
    setSelectedId(resumes[0]?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumes])

  const resumeId = selectedId ?? ''

  // Loads this resume's match history whenever the selection changes —
  // matches are stored server-side now (see supabase/migrations), so
  // switching resumes should show *that* resume's past runs, not carry
  // over whatever the previous selection had on screen.
  useEffect(() => {
    if (!resumeId) {
      setMatches([])
      return
    }

    let cancelled = false
    setMatches([])

    fetchJson<StoredJobMatch[]>(`/api/resumes/${resumeId}/match`).then((response) => {
      if (cancelled) return
      if (response.ok) setMatches(response.data)
      // A failed history load isn't worth its own error banner — Compare
      // still works, it would just start from an empty list.
    })

    return () => {
      cancelled = true
    }
  }, [resumeId])

  // A pasted bare URL (someone copied the address bar instead of the
  // posting's text) would otherwise go straight to Gemini and come back
  // with a confusing non-match — catch it client-side instead. Deliberately
  // only matches when the *entire* field is one URL, since a real JD that
  // happens to start with a link shouldn't be blocked.
  const trimmedJobDescription = jobDescription.trim()
  const looksLikeUrl = /^https?:\/\/\S+$/i.test(trimmedJobDescription)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!resumeId || !trimmedJobDescription || looksLikeUrl) return

    setStatus('loading')
    setError(null)

    const response = await fetchJson<StoredJobMatch>(`/api/resumes/${resumeId}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription }),
    })

    if (!response.ok) {
      setError(response.error)
      setStatus('error')
      return
    }

    setMatches((prev) => [response.data, ...prev])
    setJobDescription('')
    setStatus('idle')
  }

  if (resumes.length === 0) return null

  return (
    <div className="rl-card" style={{ marginTop: 40, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, transform: 'rotate(-0.3deg)' }}>
      <div>
        <span className="rl-eyebrow" style={{ transform: 'none' }}>
          Job match
        </span>
        <h2 className="rl-display" style={{ margin: '12px 0 0', fontSize: 20, fontWeight: 700 }}>
          See how this resume fits a job posting
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--rl-muted)' }}>
          Resume
          <select
            value={resumeId}
            onChange={(event) => {
              setSelectedId(event.target.value)
              setError(null)
            }}
            style={{
              borderRadius: 14,
              border: '2.5px solid var(--rl-ink)',
              background: 'var(--rl-surface)',
              color: 'var(--rl-ink)',
              padding: '12px 16px',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.original_filename}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--rl-muted)' }}>
          Job description
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--rl-muted)' }}>
            Copy the full posting from LinkedIn, Glassdoor, JobStreet — wherever you found it — and paste the text
            below. We don&rsquo;t fetch links automatically, so a URL on its own won&rsquo;t work.
          </span>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            required
            rows={6}
            placeholder="Paste the job description here…"
            aria-invalid={looksLikeUrl || undefined}
            style={{
              borderRadius: 14,
              border: `2.5px solid ${looksLikeUrl ? 'var(--rl-danger)' : 'var(--rl-ink)'}`,
              background: 'var(--rl-surface)',
              color: 'var(--rl-ink)',
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: 14,
              resize: 'vertical',
            }}
          />
          {looksLikeUrl && (
            <span role="alert" style={{ fontSize: 12, fontWeight: 600, color: 'var(--rl-danger)' }}>
              That looks like a link, not the job description — paste the posting&rsquo;s actual text instead.
            </span>
          )}
        </label>

        {error && (
          <p role="alert" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--rl-danger)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || looksLikeUrl}
          className="rl-btn rl-btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          {status === 'loading' ? 'Comparing…' : 'Compare'}
        </button>
      </form>

      {matches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '2px dashed oklch(22% 0.03 50 / 0.2)', paddingTop: 20 }}>
          <span className="rl-display" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--rl-muted)' }}>
            {matches.length === 1 ? 'Match result' : `Past matches (${matches.length})`}
          </span>
          {matches.map((match, index) => (
            <JobMatchEntry key={match.id} match={match} defaultOpen={index === 0} />
          ))}
        </div>
      )}
    </div>
  )
}

function JobMatchEntry({ match, defaultOpen }: { match: StoredJobMatch; defaultOpen: boolean }) {
  const snippet = match.jobDescription.length > 90 ? `${match.jobDescription.slice(0, 90)}…` : match.jobDescription

  return (
    <details open={defaultOpen} className="rl-card" style={{ padding: 16, boxShadow: 'none', borderWidth: 2 }}>
      <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span className="rl-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--rl-blue)' }}>
          {match.fitScore}
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--rl-muted)' }}>/100</span>
        </span>
        <span style={{ fontSize: 13, color: 'var(--rl-muted)', fontWeight: 500 }}>{snippet}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--rl-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {new Date(match.createdAt).toLocaleDateString()}
        </span>
      </summary>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--rl-muted)' }}>{match.summary}</p>

        {match.strengths.length > 0 && (
          <div>
            <span style={{ fontWeight: 700 }}>Strengths</span>
            <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14, color: 'var(--rl-muted)' }}>
              {match.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {match.gaps.length > 0 && (
          <div>
            <span style={{ fontWeight: 700 }}>Gaps</span>
            <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14, color: 'var(--rl-muted)' }}>
              {match.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
        )}

        {match.recommendations.length > 0 && (
          <div>
            <span style={{ fontWeight: 700 }}>Recommendations</span>
            <ul style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14, color: 'var(--rl-muted)' }}>
              {match.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  )
}
