import {
  isMediaCardItem,
  toMediaCard,
} from '#/lib/tmdb/normalize'
import type {
  MediaCardItem,
  TmdbMovieSummary,
  TmdbPage,
  TmdbTvSummary,
} from '#/lib/tmdb/types'

type Recommendable = {
  id: number
  popularity?: number
  vote_average: number
}

export function recommendedMovieCards({
  similar,
  recommendations,
  limit = 16,
}: {
  similar?: TmdbPage<TmdbMovieSummary>
  recommendations?: TmdbPage<TmdbMovieSummary>
  limit?: number
}): MediaCardItem[] {
  return mergedRecommendations(similar?.results, recommendations?.results)
    .map((item) => toMediaCard(item, 'movie'))
    .filter(isMediaCardItem)
    .slice(0, limit)
}

export function recommendedTvCards({
  similar,
  recommendations,
  limit = 16,
}: {
  similar?: TmdbPage<TmdbTvSummary>
  recommendations?: TmdbPage<TmdbTvSummary>
  limit?: number
}): MediaCardItem[] {
  return mergedRecommendations(similar?.results, recommendations?.results)
    .map((item) => toMediaCard(item, 'tv'))
    .filter(isMediaCardItem)
    .slice(0, limit)
}

function mergedRecommendations<T extends Recommendable>(
  similar: T[] = [],
  recommendations: T[] = [],
) {
  const byId = new Map<number, T>()

  for (const item of [...recommendations, ...similar]) {
    const existing = byId.get(item.id)
    const itemScore = score(item)
    const existingScore = existing ? score(existing) : -1
    if (!existing || itemScore > existingScore) {
      byId.set(item.id, item)
    }
  }

  return [...byId.values()].sort(
    (a, b) =>
      (b.popularity ?? 0) - (a.popularity ?? 0) ||
      b.vote_average - a.vote_average,
  )
}

function score(item: Recommendable) {
  return (item.popularity ?? 0) + item.vote_average
}
