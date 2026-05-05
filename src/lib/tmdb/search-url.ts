import type { ParsedSearchParams } from '#/lib/tmdb/search'

export const searchUrlDefaults = {
  q: '',
  type: 'all',
  page: 1,
  sort: 'popularity',
} as const satisfies Pick<ParsedSearchParams, 'q' | 'type' | 'page' | 'sort'>

export function searchHref(
  params: ParsedSearchParams,
  overrides: Partial<ParsedSearchParams> = {},
) {
  const next = { ...params, ...overrides }
  const search = new URLSearchParams()

  if (next.q) search.set('q', next.q)
  if (next.type !== searchUrlDefaults.type) search.set('type', next.type)
  if (next.page !== searchUrlDefaults.page) search.set('page', String(next.page))
  if (next.year) search.set('year', String(next.year))
  if (next.sort !== searchUrlDefaults.sort) search.set('sort', next.sort)
  if (next.genre) search.set('genre', next.genre)

  const query = search.toString()
  return query ? `/search?${query}` : '/search'
}

export function searchServerInput(params: ParsedSearchParams) {
  return {
    ...params,
    year: params.year || undefined,
    genre: params.genre || undefined,
  }
}
