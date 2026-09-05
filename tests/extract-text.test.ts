import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { extractResumeText, InvalidResumeFileError, CorruptResumeFileError } from '../lib/resume/extract-text'

function readFixture(name: string) {
  return readFileSync(path.resolve(import.meta.dirname, 'fixtures', name))
}

describe('extractResumeText', () => {
  it('extracts text from a real PDF fixture', async () => {
    const file = new File([readFixture('resume.pdf')], 'resume.pdf', { type: 'application/pdf' })
    const text = await extractResumeText(file)
    expect(text).toContain('Jane Doe')
    expect(text).toContain('State University')
  })

  it('rejects a file over the size limit', async () => {
    const oversized = new File([new Uint8Array(11 * 1024 * 1024)], 'resume.pdf', { type: 'application/pdf' })
    await expect(extractResumeText(oversized)).rejects.toBeInstanceOf(InvalidResumeFileError)
  })

  it('rejects an unsupported file type', async () => {
    const file = new File([Buffer.from('hello')], 'resume.txt', { type: 'text/plain' })
    await expect(extractResumeText(file)).rejects.toBeInstanceOf(InvalidResumeFileError)
  })

  it('treats an unparseable PDF as corrupt rather than throwing an unhandled error', async () => {
    const file = new File([Buffer.from('not actually a pdf')], 'resume.pdf', { type: 'application/pdf' })
    await expect(extractResumeText(file)).rejects.toBeInstanceOf(CorruptResumeFileError)
  })
})
