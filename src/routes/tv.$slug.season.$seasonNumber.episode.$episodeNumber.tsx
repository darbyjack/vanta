import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router'
import { Container } from '#/components/layout/Container'
import {
  CastSection,
  CrewLine,
} from '#/features/movie/components/DetailSections'
import { guardedPageHandlers } from '#/lib/bots/server-route'
import { getTvEpisodePageData } from '#/lib/tmdb/entity.functions'
import { tmdbImage } from '#/lib/tmdb/images'
import { formatDate, formatRuntime } from '#/lib/tmdb/normalize'
import type { TmdbCredit } from '#/lib/tmdb/types'
import { parseLeadingId } from '#/lib/url/slug'

export const Route = createFileRoute(
  '/tv/$slug/season/$seasonNumber/episode/$episodeNumber',
)({
  server: {
    handlers: guardedPageHandlers(),
  },
  loader: async ({ params }) => {
    const id = parseLeadingId(params.slug)
    const seasonNumber = parseNumberParam(params.seasonNumber)
    const episodeNumber = parseNumberParam(params.episodeNumber)
    if (!id || seasonNumber === null || episodeNumber === null) {
      throw notFound()
    }

    const data = await getTvEpisodePageData({
      data: { id, seasonNumber, episodeNumber },
    })
    if (!data) throw notFound()
    if (
      params.slug !== data.canonicalSlug ||
      Number(params.seasonNumber) !== data.season.season_number ||
      Number(params.episodeNumber) !== data.episode.episode_number
    ) {
      throw redirect({
        to: '/tv/$slug/season/$seasonNumber/episode/$episodeNumber',
        params: {
          slug: data.canonicalSlug,
          seasonNumber: String(data.season.season_number),
          episodeNumber: String(data.episode.episode_number),
        },
      })
    }

    return data
  },
  preload: false,
  staleTime: 24 * 60 * 60 * 1000,
  head: ({ loaderData }) => entityHead(loaderData?.seo),
  component: EpisodePage,
  notFoundComponent: () => <EntityNotFound label="Episode" />,
})

function EpisodePage() {
  const { tv, season, episode, credits } = Route.useLoaderData()
  const { slug } = Route.useParams()
  const still = tmdbImage(episode.still_path, 'w780')
  const guestStars = credits?.guest_stars ?? episode.guest_stars ?? []
  const mainCast = credits?.cast ?? []
  const crew = keyEpisodeCrew(credits?.crew ?? episode.crew ?? [])

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
          <span> / </span>
          <Link
            to="/tv/$slug/season/$seasonNumber"
            params={{ slug, seasonNumber: String(season.season_number) }}
            className="hover:text-primary"
          >
            {season.name}
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.16em] text-primary">
              S{episode.season_number} E{episode.episode_number}
            </p>
            <h1 className="text-4xl font-semibold tracking-normal">
              {episode.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {formatDate(episode.air_date) ? (
                <span>{formatDate(episode.air_date)}</span>
              ) : null}
              {formatRuntime(episode.runtime) ? (
                <span>{formatRuntime(episode.runtime)}</span>
              ) : null}
            </div>
            {episode.overview ? (
              <p className="mt-5 leading-7 text-muted-foreground">
                {episode.overview}
              </p>
            ) : null}
          </div>
          {still ? (
            <img
              src={still}
              alt={`${episode.name} still`}
              className="aspect-video w-full rounded-md object-cover"
              loading="eager"
              decoding="async"
            />
          ) : null}
        </div>

        <CastSection cast={guestStars} title="Guest Stars" limit={24} />
        <CastSection cast={mainCast} title="Main Cast" limit={12} />
        <CrewSection crew={crew} />
      </Container>
    </main>
  )
}

const keyCrewJobs = new Set([
  'Director',
  'Writer',
  'Screenplay',
  'Teleplay',
  'Story',
  'Creator',
])

function keyEpisodeCrew(crew: TmdbCredit[]) {
  const keyCrew = crew.filter(
    (person) => person.job && keyCrewJobs.has(person.job),
  )
  return keyCrew.length ? keyCrew : crew
}

function CrewSection({ crew }: { crew: TmdbCredit[] }) {
  if (!crew.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Crew</h2>
      <CrewLine label="Key crew" crew={crew} />
    </section>
  )
}

function parseNumberParam(value: string) {
  if (!/^\d+$/.test(value)) return null
  const number = Number(value)
  return number > 0 ? number : null
}

function entityHead(seo?: {
  title: string
  description: string
  url: string
  image?: string
}) {
  return {
    meta: [
      { title: seo?.title ? `${seo.title} | Vanta` : 'TV Episode | Vanta' },
      {
        name: 'description',
        content: seo?.description ?? 'TV episode data powered by TMDB.',
      },
      { property: 'og:title', content: seo?.title ?? 'TV Episode | Vanta' },
      {
        property: 'og:description',
        content: seo?.description ?? 'TV episode data powered by TMDB.',
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
