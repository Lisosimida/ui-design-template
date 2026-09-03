import { defineConfig } from 'vitest/config'
import { config as loadDotenv } from 'dotenv'
import path from 'node:path'

// Tests need the same NEXT_PUBLIC_SUPABASE_* values Next.js reads from
// .env.local — Vitest doesn't load Next's env files on its own.
loadDotenv({ path: path.resolve(import.meta.dirname, '.env.local') })

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '.next', '.open-next'],
    hookTimeout: 30000,
    // These tests hit a real Supabase project over the network (by design —
    // see the RLS/middleware seams in the spec), so the 5s default is too
    // tight once corporate TLS inspection adds round-trip overhead.
    testTimeout: 20000,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
})
