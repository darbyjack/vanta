import { getEnv } from '#/lib/tmdb/env.server'
import { tmdbImage } from '#/lib/tmdb/images'
import { trimText } from '#/lib/tmdb/normalize'

export function absoluteUrl(path: string) {
  return new URL(path, getEnv().SITE_URL).toString()
}

export function entitySeo({
  title,
  description,
  path,
  imagePath,
}: {
  title: string
  description?: string | null
  path: string
  imagePath?: string | null
}) {
  const text =
    trimText(description, 155) || 'Movie, TV, and people data powered by TMDB.'
  const image = tmdbImage(imagePath, 'w780') ?? undefined
  const url = absoluteUrl(path)

  return { title, description: text, url, image }
}
