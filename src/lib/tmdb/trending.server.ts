import { tmdbFetch, TmdbError } from '#/lib/tmdb/client.server'
import type {
  TmdbMovieSummary,
  TmdbPage,
  TmdbTvSummary,
} from '#/lib/tmdb/types'

async function safePage<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  try {
    return (await tmdbFetch<TmdbPage<T>>(path, params))?.results ?? []
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes('TMDB_API_KEY')) {
      return []
    }

    console.error(error)
    return []
  }
}

export async function getTrending() {
  const [movies, tv] = await Promise.all([
    safePage<TmdbMovieSummary>('/trending/movie/day'),
    safePage<TmdbTvSummary>('/trending/tv/day'),
  ])

  return { movies, tv }
}

export async function getPopular() {
  const [movies, tv] = await Promise.all([
    safePage<TmdbMovieSummary>('/movie/popular'),
    safePage<TmdbTvSummary>('/tv/popular'),
  ])

  return { movies, tv }
}

export async function getNewReleases() {
  const today = new Date().toISOString().slice(0, 10)
  const [movies, tv] = await Promise.all([
    safePage<TmdbMovieSummary>('/movie/now_playing'),
    safePage<TmdbTvSummary>('/discover/tv', {
      sort_by: 'first_air_date.desc',
      'first_air_date.lte': today,
      include_null_first_air_dates: false,
    }),
  ])

  return { movies, tv }
}
