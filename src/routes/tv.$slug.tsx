import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { Badge } from '#/components/ui/Badge'
import { BackdropImage } from '#/components/media/BackdropImage'
import { PosterImage } from '#/components/media/PosterImage'
import { RatingBadge } from '#/components/media/RatingBadge'
import { Container } from '#/components/layout/Container'
import {
  CastSection,
  CrewLine,
  pickTrailer,
  ProvidersSection,
  SimilarTv,
  TrailerLink,
} from '#/features/movie/components/DetailSections'
import { getTvPageData } from '#/lib/tmdb/entity.functions'
import { compactNumber, formatDate, yearFrom } from '#/lib/tmdb/normalize'
import { parseLeadingId } from '#/lib/url/slug'

export const Route = createFileRoute('/tv/$slug')({
  loader: async ({ params }) => {
    const id = parseLeadingId(params.slug)
    if (!id) throw notFound()

    const data = await getTvPageData({ data: { id } })
    if (!data) throw notFound()
    if (params.slug !== data.canonicalSlug) {
      throw redirect({ to: '/tv/$slug', params: { slug: data.canonicalSlug } })
    }

    return data
  },
  staleTime: 24 * 60 * 60 * 1000,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.seo.title ?? 'TV | Vanta' },
      { name: 'description', content: loaderData?.seo.description ?? 'TV data powered by TMDB.' },
      { property: 'og:title', content: loaderData?.seo.title ?? 'TV | Vanta' },
      { property: 'og:description', content: loaderData?.seo.description ?? 'TV data powered by TMDB.' },
      ...(loaderData?.seo.url ? [{ property: 'og:url', content: loaderData.seo.url }] : []),
      ...(loaderData?.seo.image ? [{ property: 'og:image', content: loaderData.seo.image }] : []),
    ],
    links: loaderData?.seo.url ? [{ rel: 'canonical', href: loaderData.seo.url }] : [],
    scripts: loaderData?.jsonLd
      ? [{ type: 'application/ld+json', children: JSON.stringify(loaderData.jsonLd) }]
      : [],
  }),
  component: TvPage,
  notFoundComponent: () => <EntityNotFound label="TV show" />,
})

function TvPage() {
  const { tv } = Route.useLoaderData()
  const trailer = pickTrailer(tv.videos)

  return (
    <main>
      <div className="relative">
        <BackdropImage path={tv.backdrop_path} alt={`${tv.name} backdrop`} />
        <Container className="grid gap-8 py-10 md:grid-cols-[220px_1fr] lg:py-16">
          <div className="max-w-[220px]">
            <PosterImage path={tv.poster_path} alt={`${tv.name} poster`} eager size="w500" />
          </div>
          <div className="max-w-3xl self-end">
            <h1 className="text-4xl font-semibold tracking-normal">{tv.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {yearFrom(tv.first_air_date) ? <span>{yearFrom(tv.first_air_date)}</span> : null}
              {tv.status ? <span>{tv.status}</span> : null}
              <span>{tv.number_of_seasons} seasons</span>
              <span>{tv.number_of_episodes} episodes</span>
              <RatingBadge rating={tv.vote_average} votes={compactNumber(tv.vote_count)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tv.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary" className="rounded">
                  {genre.name}
                </Badge>
              ))}
            </div>
            {tv.overview ? (
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{tv.overview}</p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              <TrailerLink videoKey={trailer} title={tv.name} />
              <div className="space-y-1 text-sm">
                <CrewLine label="Creator" crew={tv.created_by ?? []} />
                {tv.last_air_date ? <p><span className="text-muted-foreground">Last aired: </span>{formatDate(tv.last_air_date)}</p> : null}
                {tv.next_episode_to_air?.air_date ? <p><span className="text-muted-foreground">Next: </span>{formatDate(tv.next_episode_to_air.air_date)}</p> : null}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <CastSection cast={tv.credits?.cast ?? []} />
        <ProvidersSection providers={tv['watch/providers']?.results?.US} />
        <SimilarTv tv={tv} />
      </Container>
    </main>
  )
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
