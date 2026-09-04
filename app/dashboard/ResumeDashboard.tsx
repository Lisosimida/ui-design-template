'use client'

import { useRef, useState, type FormEvent } from 'react'
import type { StoredResume } from './types'

// Owns the resume list as local state (seeded from the server's initial
// fetch) rather than re-fetching via router.refresh() after every upload or
// delete — a prior version kept the just-uploaded result in separate state
// from the list and used router.refresh(), which left a stale duplicate of
// the result on screen after the same resume was later deleted from the
// list. One state, updated directly by each action, can't drift like that.
export default function ResumeDashboard({ initialResumes }: { initialResumes: StoredResume[] }) {
  const [resumes, setResumes] = useState<StoredResume[]>(initialResumes)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setStatus('loading')
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/resumes', { method: 'POST', body: formData })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setResumes((prev) => [data as StoredResume, ...prev])
      setStatus('idle')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setError('Could not reach the server. Please try again.')
      setStatus('error')
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return

    setDeletingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error ?? 'Could not delete this resume. Please try again.')
        return
      }

      setResumes((prev) => prev.filter((resume) => resume.id !== id))
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-8">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Resume (PDF or DOCX)
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            className="rounded-xl border border-border/15 bg-surface-2 px-4 py-3 text-fg outline-none focus-visible:border-accent"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary self-start disabled:opacity-60">
          {status === 'loading' ? 'Analyzing…' : status === 'error' ? 'Retry upload' : 'Upload resume'}
        </button>
      </form>

      {resumes.length > 0 && (
        <div className="flex flex-col gap-4">
          <span className="eyebrow w-fit">Your resumes</span>

          {resumes.map((resume) => (
            <div key={resume.id} className="card flex flex-col gap-6 p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-fg">{resume.original_filename}</h2>
                  <p className="mt-1 text-xs text-muted">{new Date(resume.created_at).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(resume.id)}
                  disabled={deletingId === resume.id}
                  className="btn-secondary shrink-0 !px-4 !py-2 text-xs disabled:opacity-60"
                >
                  {deletingId === resume.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>

              <div className="flex flex-col gap-2 text-sm text-muted">
                <p>
                  <span className="font-semibold text-fg">Clarity — </span>
                  {resume.feedback.clarity}
                </p>
                <p>
                  <span className="font-semibold text-fg">Impact — </span>
                  {resume.feedback.impact}
                </p>
                {resume.feedback.gaps.length > 0 && (
                  <div>
                    <span className="font-semibold text-fg">Gaps</span>
                    <ul className="mt-1 list-disc pl-5">
                      {resume.feedback.gaps.map((gap) => (
                        <li key={gap}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {resume.parsed_data.skills.length > 0 && (
                <div>
                  <span className="font-semibold text-fg">Skills</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resume.parsed_data.skills.map((skill) => (
                      <span key={skill} className="eyebrow normal-case">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {resume.parsed_data.experience.length > 0 && (
                <div>
                  <span className="font-semibold text-fg">Experience</span>
                  <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
                    {resume.parsed_data.experience.map((role, index) => (
                      <li key={index}>
                        <span className="text-fg">{role.title}</span> — {role.company}
                        {role.duration ? ` (${role.duration})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {resume.parsed_data.education.length > 0 && (
                <div>
                  <span className="font-semibold text-fg">Education</span>
                  <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
                    {resume.parsed_data.education.map((entry, index) => (
                      <li key={index}>
                        <span className="text-fg">{entry.institution}</span>
                        {entry.degree ? ` — ${entry.degree}` : ''}
                        {entry.year ? ` (${entry.year})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
