import { getDocumentProxy, extractText as extractPdfText } from 'unpdf'
import mammoth from 'mammoth'

export class InvalidResumeFileError extends Error {}
export class CorruptResumeFileError extends Error {}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
// The 10MB cap above is on the compressed upload — a DOCX (a zip) or a
// text-dense PDF can still decompress/extract into far more text than that,
// which would otherwise flow uncapped into the Claude call and the DB. This
// caps it well above any real resume (a few thousand words) while still
// catching pathological files.
const MAX_EXTRACTED_TEXT_LENGTH = 100_000
const DOCX_MEDIA_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

function isPdf(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function isDocx(file: File): boolean {
  return file.type === DOCX_MEDIA_TYPE || file.name.toLowerCase().endsWith('.docx')
}

// Extracts resume text from an uploaded PDF or DOCX file. Throws
// InvalidResumeFileError for a bad upload (wrong type, too large) and
// CorruptResumeFileError when the file is the right type but unreadable —
// the route handler maps both to 400, with distinct messages.
export async function extractResumeText(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new InvalidResumeFileError('File is too large — the limit is 10MB.')
  }

  if (!isPdf(file) && !isDocx(file)) {
    throw new InvalidResumeFileError('Unsupported file type — upload a PDF or DOCX resume.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  let text: string
  try {
    text = isPdf(file) ? await extractFromPdf(buffer) : await extractFromDocx(buffer)
  } catch (err) {
    if (err instanceof CorruptResumeFileError) throw err
    throw new CorruptResumeFileError('This file could not be read — it may be corrupt or password-protected.')
  }

  if (!text.trim()) {
    throw new CorruptResumeFileError('No readable text was found in this file.')
  }

  if (text.length > MAX_EXTRACTED_TEXT_LENGTH) {
    throw new InvalidResumeFileError('This file contains too much text to analyze — is it actually a resume?')
  }

  return text
}

async function extractFromPdf(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractPdfText(pdf, { mergePages: true })
  return text
}

async function extractFromDocx(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer })
  return value
}
