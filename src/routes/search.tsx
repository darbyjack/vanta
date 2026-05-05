import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { Container } from '#/components/layout/Container'
import { MediaGrid } from '#/components/media/MediaGrid'
import { EmptySearchState } from '#/features/search/components/EmptySearchState'
import { SearchForm } from '#/features/search/components/SearchForm'
import { SearchPagination } from '#/features/search/components/SearchPagination'
import { SearchTypeTabs } from '#/features/search/components/SearchTypeTabs'
import { guardedPageHandlers } from '#/lib/bots/server-route'
import { getSearchPageData } from '#/lib/tmdb/search.functions'
import { searchParamsSchema } from '#/lib/tmdb/search'
import { searchServerInput, searchUrlDefaults } from '#/lib/tmdb/search-url'

export const Route = createFileRoute('/search')({
  server: {
    handlers: guardedPageHandlers(),
  },
  validateSearch: searchParamsSchema,
  search: {
    middlewares: [
      stripSearchParams(searchUrlDefaults),
    ],
  },
  loaderDeps: ({ search: { q, type, page, year, sort, genre } }) => ({
    q,
    type,
    page,
    year,
    sort,
    genre,
  }),
  loader: ({ deps }) => getSearchPageData({ data: searchServerInput(deps) }),
  staleTime: 5 * 60 * 1000,
  head: ({ loaderData }) => {
    const query = loaderData?.params.q
    const title = query ? `Search results for ${query} | Vanta` : 'Search | Vanta'

    return {
      meta: [
        { title },
        {
          name: 'description',
          content: query
            ? `Server-rendered TMDB search results for ${query}.`
            : 'Search movies, TV shows, and people from TMDB.',
        },
        { name: 'robots', content: 'noindex,follow' },
      ],
    }
  },
  component: SearchPage,
})

function SearchPage() {
  const { params, items, totalPages, totalResults } = Route.useLoaderData()

  return (
    <main>
      <Container className="py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Search</h1>
            <p className="mt-2 text-muted-foreground">
              Find movies, TV shows, and people from TMDB.
            </p>
          </div>

          <SearchForm params={params} />

          {params.q || params.year || params.genre || params.sort !== 'popularity' ? (
            <div className="space-y-3">
              <SearchTypeTabs params={params} />
              <p className="text-sm text-muted-foreground">
                {totalResults.toLocaleString('en-US')} result
                {totalResults === 1 ? '' : 's'}
                {params.q ? ` for "${params.q}"` : ''}
              </p>
            </div>
          ) : null}

          {items.length ? (
            <>
              <MediaGrid items={items} />
              <SearchPagination
                params={params}
                totalPages={totalPages}
              />
            </>
          ) : (
            <EmptySearchState query={params.q || undefined} />
          )}
        </div>
      </Container>
    </main>
  )
}
