import { tmdbFetch, TmdbError } from '#/lib/tmdb/client.server'
import { hasSearchFilters } from '#/lib/tmdb/search'
import type { ParsedSearchParams } from '#/lib/tmdb/search'
import type {
  TmdbMovieSummary,
  TmdbPage,
  TmdbSearchResult,
  TmdbTvSummary,
} from '#/lib/tmdb/types'
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
  year,
  sort,
  genre,
}: ParsedSearchParams) {
  const normalized = normalizeQuery(q).toLowerCase()
  const params = { q: normalized, type, page, year, sort, genre }
  const filtered = hasSearchFilters(params)
  if (!normalized && !filtered) return emptySearchPage

  if (filtered && type !== 'person') {
    return discoverTmdb(params)
  }

  const path = type === 'all' ? '/search/multi' : `/search/${type}`

  try {
    return (
      (await tmdbFetch<TmdbPage<TmdbSearchResult>>(path, {
        query: normalized,
        page,
        include_adult: false,
        ...(year && type === 'movie' ? { primary_release_year: year } : {}),
        ...(year && type === 'tv' ? { first_air_date_year: year } : {}),
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

async function discoverTmdb(params: ParsedSearchParams) {
  if (params.type === 'movie') return discoverSingle('movie', params)
  if (params.type === 'tv') return discoverSingle('tv', params)

  const [movies, tv] = await Promise.all([
    discoverSingle('movie', params),
    discoverSingle('tv', params),
  ])
  const results = [...movies.results, ...tv.results].sort((a, b) =>
    searchSortValue(b, params.sort) - searchSortValue(a, params.sort),
  )

  return {
    page: params.page,
    results,
    total_pages: Math.min(Math.max(movies.total_pages, tv.total_pages), 500),
    total_results: movies.total_results + tv.total_results,
  } satisfies TmdbPage<TmdbSearchResult>
}

async function discoverSingle(
  type: 'movie' | 'tv',
  { q, page, year, sort, genre }: ParsedSearchParams,
) {
  try {
    const result =
      (await tmdbFetch<TmdbPage<TmdbMovieSummary | TmdbTvSummary>>(
        `/discover/${type}`,
        {
          page,
          include_adult: false,
          sort_by: sortParam(type, sort),
          ...(q ? { with_text_query: q } : {}),
          ...(genre ? { with_genres: genre } : {}),
          ...(year && type === 'movie' ? { primary_release_year: year } : {}),
          ...(year && type === 'tv' ? { first_air_date_year: year } : {}),
        },
      )) ?? emptySearchPage

    return {
      ...result,
      results: result.results.map((item) => ({ ...item, media_type: type })),
    } satisfies TmdbPage<TmdbSearchResult>
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes('TMDB_API_KEY')) {
      return emptySearchPage
    }

    console.error(error)
    throw error
  }
}

function sortParam(type: 'movie' | 'tv', sort: ParsedSearchParams['sort']) {
  if (sort === 'rating') return 'vote_average.desc'
  if (sort === 'release_date') {
    return type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'
  }
  return 'popularity.desc'
}

function searchSortValue(item: TmdbSearchResult, sort: ParsedSearchParams['sort']) {
  if (sort === 'rating') return 'vote_average' in item ? item.vote_average : 0
  if (sort === 'release_date') {
    const date =
      'release_date' in item ? item.release_date : 'first_air_date' in item ? item.first_air_date : ''
    return date ? new Date(`${date}T00:00:00Z`).getTime() : 0
  }
  return 'popularity' in item ? item.popularity ?? 0 : 0
}
