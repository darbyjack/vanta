import { z } from 'zod'

const envSchema = z.object({
  TMDB_API_KEY: z.string().min(1).optional(),
  SITE_URL: z.url().default('http://localhost:3000'),
})

export type TmdbEnv = z.infer<typeof envSchema>

let cachedEnv: TmdbEnv | null = null

export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse({
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      SITE_URL: process.env.SITE_URL,
    })
  }

  return cachedEnv
}

export function hasTmdbKey() {
  return Boolean(getEnv().TMDB_API_KEY)
}
