import {
  createFileRoute,
  Link,
  Outlet,
  notFound,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { Container } from '#/components/layout/Container'
import { PosterImage } from '#/components/media/PosterImage'
import {
  CastSection,
  CrewLine,
} from '#/features/movie/components/DetailSections'
import { guardedPageHandlers } from '#/lib/bots/server-route'
import { getTvSeasonPageData } from '#/lib/tmdb/entity.functions'
import { tmdbImage } from '#/lib/tmdb/images'
import { formatDate, formatRuntime, trimText } from '#/lib/tmdb/normalize'
import type { TmdbEpisode } from '#/lib/tmdb/types'
import { parseLeadingId } from '#/lib/url/slug'

export const Route = createFileRoute('/tv/$slug/season/$seasonNumber')({
  server: {
    handlers: guardedPageHandlers(),
  },
  loader: async ({ params }) => {
    const id = parseLeadingId(params.slug)
    const seasonNumber = parseNumberParam(params.seasonNumber, 0)
    if (!id || seasonNumber === null) throw notFound()

    const data = await getTvSeasonPageData({ data: { id, seasonNumber } })
    if (!data) throw notFound()
    if (
      params.slug !== data.canonicalSlug ||
      Number(params.seasonNumber) !== data.season.season_number
    ) {
      throw redirect({
        to: '/tv/$slug/season/$seasonNumber',
        params: {
          slug: data.canonicalSlug,
          seasonNumber: String(data.season.season_number),
        },
      })
    }

    return data
  },
  preload: false,
  staleTime: 24 * 60 * 60 * 1000,
  head: ({ loaderData }) => entityHead(loaderData?.seo),
  component: SeasonPage,
  notFoundComponent: () => <EntityNotFound label="Season" />,
})

function SeasonPage() {
  const { tv, season } = Route.useLoaderData()
  const { slug } = Route.useParams()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  if (pathname !== `/tv/${slug}/season/${season.season_number}`) {
    return <Outlet />
  }

  return (
    <main>
      <Container className="py-8">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link
            to="/tv/$slug"
            params={{ slug }}
            className="hover:text-primary"
          >
            {tv.name}
          </Link>
          <span> / {season.name}</span>
        </div>
        <div className="grid gap-8 md:grid-cols-[200px_1fr]">
          <div className="max-w-[200px]">
            <PosterImage
              path={season.poster_path ?? tv.poster_path}
              alt={`${season.name} poster`}
              eager
              size="w500"
            />
          </div>
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-primary">
              {season.season_number === 0
                ? 'Specials'
                : `Season ${season.season_number}`}
            </p>
            <h1 className="text-4xl font-semibold tracking-normal">
              {season.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {formatDate(season.air_date) ? (
                <span>{formatDate(season.air_date)}</span>
              ) : null}
              <span>{season.episodes.length} episodes</span>
            </div>
            {season.overview ? (
              <p className="mt-5 leading-7 text-muted-foreground">
                {season.overview}
              </p>
            ) : null}
          </div>
        </div>

        <EpisodeList episodes={season.episodes} slug={slug} />
        <CastSection cast={season.credits?.cast ?? []} />
        <CrewLine label="Season crew" crew={season.credits?.crew ?? []} />
      </Container>
    </main>
  )
}

function EpisodeList({
  episodes,
  slug,
}: {
  episodes: TmdbEpisode[]
  slug: string
}) {
  if (!episodes.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Episodes</h2>
      <div className="space-y-3">
        {episodes.map((episode) => (
          <EpisodeRow key={episode.id} episode={episode} slug={slug} />
        ))}
      </div>
    </section>
  )
}

function EpisodeRow({
  episode,
  slug,
}: {
  episode: TmdbEpisode
  slug: string
}) {
  const still = tmdbImage(episode.still_path, 'w342')

  return (
    <Link
      to="/tv/$slug/season/$seasonNumber/episode/$episodeNumber"
      params={{
        slug,
        seasonNumber: String(episode.season_number),
        episodeNumber: String(episode.episode_number),
      }}
      className="grid gap-3 rounded-md border border-border bg-card p-3 no-underline hover:border-primary/40 sm:grid-cols-[160px_1fr]"
    >
      {still ? (
        <img
          src={still}
          alt={`${episode.name} still`}
          className="aspect-video w-full rounded object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="aspect-video w-full rounded bg-muted" />
      )}
      <span className="min-w-0">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
          S{episode.season_number} E{episode.episode_number}
        </span>
        <span className="mt-1 block text-base font-medium text-foreground">
          {episode.name}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {[formatDate(episode.air_date), formatRuntime(episode.runtime)]
            .filter(Boolean)
            .join(' · ')}
        </span>
        {episode.overview ? (
          <span className="mt-2 block text-sm leading-6 text-muted-foreground">
            {trimText(episode.overview, 220)}
          </span>
        ) : null}
      </span>
    </Link>
  )
}

function parseNumberParam(value: string, min: number) {
  if (!/^\d+$/.test(value)) return null
  const number = Number(value)
  return number >= min ? number : null
}

function entityHead(seo?: {
  title: string
  description: string
  url: string
  image?: string
}) {
  return {
    meta: [
      { title: seo?.title ? `${seo.title} | Vanta` : 'TV Season | Vanta' },
      {
        name: 'description',
        content: seo?.description ?? 'TV season data powered by TMDB.',
      },
      { property: 'og:title', content: seo?.title ?? 'TV Season | Vanta' },
      {
        property: 'og:description',
        content: seo?.description ?? 'TV season data powered by TMDB.',
      },
      ...(seo?.url ? [{ property: 'og:url', content: seo.url }] : []),
      ...(seo?.image ? [{ property: 'og:image', content: seo.image }] : []),
    ],
    links: seo?.url ? [{ rel: 'canonical', href: seo.url }] : [],
  }
}

function EntityNotFound({ label }: { label: string }) {
  return (
    <Container className="py-16">
      <div className="rounded-md border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">{label} not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The TMDB item may not exist, or the server-side TMDB key is missing.
        </p>
      </div>
    </Container>
  )
}
