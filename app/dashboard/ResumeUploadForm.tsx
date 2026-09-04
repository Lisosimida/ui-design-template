'use client'

import { useRef, useState, type FormEvent } from 'react'

type ResumeResult = {
  id: string
  original_filename: string
  parsed_data: {
    name: string | null
    skills: string[]
    experience: { title: string; company: string; duration: string | null; highlights: string[] }[]
    education: { institution: string; degree: string | null; year: string | null }[]
  }
  feedback: {
    clarity: string
    impact: string
    gaps: string[]
  }
}

export default function ResumeUploadForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResumeResult | null>(null)
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

      setResult(data)
      setStatus('idle')
    } catch {
      setError('Could not reach the server. Please try again.')
      setStatus('error')
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
          {status === 'loading' ? 'Analyzing…' : error ? 'Retry upload' : 'Upload resume'}
        </button>
      </form>

      {result && (
        <div className="card flex flex-col gap-6 p-8">
          <div>
            <span className="eyebrow">Feedback</span>
            <h2 className="mt-3 font-display text-xl font-bold text-fg">{result.original_filename}</h2>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted">
            <p>
              <span className="font-semibold text-fg">Clarity — </span>
              {result.feedback.clarity}
            </p>
            <p>
              <span className="font-semibold text-fg">Impact — </span>
              {result.feedback.impact}
            </p>
            {result.feedback.gaps.length > 0 && (
              <div>
                <span className="font-semibold text-fg">Gaps</span>
                <ul className="mt-1 list-disc pl-5">
                  {result.feedback.gaps.map((gap) => (
                    <li key={gap}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.parsed_data.skills.length > 0 && (
            <div>
              <span className="font-semibold text-fg">Skills</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.parsed_data.skills.map((skill) => (
                  <span key={skill} className="eyebrow normal-case">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.parsed_data.experience.length > 0 && (
            <div>
              <span className="font-semibold text-fg">Experience</span>
              <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
                {result.parsed_data.experience.map((role, index) => (
                  <li key={index}>
                    <span className="text-fg">{role.title}</span> — {role.company}
                    {role.duration ? ` (${role.duration})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.parsed_data.education.length > 0 && (
            <div>
              <span className="font-semibold text-fg">Education</span>
              <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
                {result.parsed_data.education.map((entry, index) => (
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
      )}
    </div>
  )
}
