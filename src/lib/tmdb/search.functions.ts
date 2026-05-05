import { createServerFn } from '@tanstack/react-start'
import { applyCachePolicy } from '#/lib/cache/policies'
import { isMediaCardItem, toMediaCard } from '#/lib/tmdb/normalize'
import { searchParamsSchema } from '#/lib/tmdb/search'
import { searchTmdb } from '#/lib/tmdb/search.server'

export const getSearchPageData = createServerFn({ method: 'GET' })
  .inputValidator(searchParamsSchema)
  .handler(async ({ data }) => {
    const results = await searchTmdb(data)
    applyCachePolicy('SEARCH', 'search')
    const items = results.results
      .map((item) =>
        toMediaCard(item, data.type === 'all' ? undefined : data.type),
      )
      .filter(isMediaCardItem)

    return {
      params: data,
      items,
      page: results.page,
      totalPages: Math.min(results.total_pages, 500),
      totalResults: results.total_results,
    }
  })
