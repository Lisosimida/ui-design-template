import { getCloudflareBinding } from '@/lib/cloudflare/env'

export interface OllamaConfig {
  baseUrl: string
  model: string
}

const DEFAULT_BASE_URL = 'http://localhost:11434'
const DEFAULT_MODEL = 'llama3.1'

// Unlike an API key, there's nothing to validate up front — Ollama has no
// concept of "not configured", just "reachable or not" — so this always
// returns a config (falling back to the defaults a fresh local Ollama
// install already uses) and lets an unreachable server surface as the
// analyzeResume() call failing (mapped to 502 by the route), not a 503.
export async function getOllamaConfig(): Promise<OllamaConfig> {
  const baseUrl =
    (await getCloudflareBinding<string>('OLLAMA_BASE_URL')) ?? process.env.OLLAMA_BASE_URL ?? DEFAULT_BASE_URL
  const model = (await getCloudflareBinding<string>('OLLAMA_MODEL')) ?? process.env.OLLAMA_MODEL ?? DEFAULT_MODEL

  return { baseUrl, model }
}
