import { tmdbFetch, TmdbError } from '#/lib/tmdb/client.server'
import type { ParsedSearchParams } from '#/lib/tmdb/search'
import type { TmdbPage, TmdbSearchResult } from '#/lib/tmdb/types'
import { normalizeQuery } from '#/lib/url/slug'

const emptySearchPage = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
} satisfies TmdbPage<TmdbSearchResult>

export async function searchTmdb({
  q,
  type,
  page,
}: ParsedSearchParams) {
  const normalized = normalizeQuery(q).toLowerCase()
  if (!normalized) return emptySearchPage

  const path = type === 'all' ? '/search/multi' : `/search/${type}`

  try {
    return (
      (await tmdbFetch<TmdbPage<TmdbSearchResult>>(path, {
        query: normalized,
        page,
        include_adult: false,
      })) ?? emptySearchPage
    )
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes('TMDB_API_KEY')) {
      return emptySearchPage
    }

    console.error(error)
    throw error
  }
}
