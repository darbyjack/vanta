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
  SimilarMovies,
  TrailerLink,
} from '#/features/movie/components/DetailSections'
import { getMoviePageData } from '#/lib/tmdb/entity.functions'
import { compactNumber, formatRuntime, yearFrom } from '#/lib/tmdb/normalize'
import { parseLeadingId } from '#/lib/url/slug'

export const Route = createFileRoute('/movie/$slug')({
  loader: async ({ params }) => {
    const id = parseLeadingId(params.slug)
    if (!id) throw notFound()

    const data = await getMoviePageData({ data: { id } })
    if (!data) throw notFound()
    if (params.slug !== data.canonicalSlug) {
      throw redirect({ to: '/movie/$slug', params: { slug: data.canonicalSlug } })
    }

    return data
  },
  preload: false,
  staleTime: 24 * 60 * 60 * 1000,
  head: ({ loaderData }) => entityHead(loaderData?.seo, loaderData?.jsonLd),
  component: MoviePage,
  notFoundComponent: EntityNotFound,
})

function MoviePage() {
  const { movie } = Route.useLoaderData()
  const directors =
    movie.credits?.crew.filter((person) => person.job === 'Director') ?? []
  const writers =
    movie.credits?.crew.filter((person) =>
      ['Writer', 'Screenplay', 'Story'].includes(person.job ?? ''),
    ) ?? []
  const trailer = pickTrailer(movie.videos)

  return (
    <main>
      <div className="relative">
        <BackdropImage path={movie.backdrop_path} alt={`${movie.title} backdrop`} />
        <Container className="grid gap-8 py-10 md:grid-cols-[220px_1fr] lg:py-16">
          <div className="max-w-[220px]">
            <PosterImage path={movie.poster_path} alt={`${movie.title} poster`} eager size="w500" />
          </div>
          <div className="max-w-3xl self-end">
            <h1 className="text-4xl font-semibold tracking-normal">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {yearFrom(movie.release_date) ? <span>{yearFrom(movie.release_date)}</span> : null}
              {formatRuntime(movie.runtime) ? <span>{formatRuntime(movie.runtime)}</span> : null}
              <RatingBadge rating={movie.vote_average} votes={compactNumber(movie.vote_count)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary" className="rounded">
                  {genre.name}
                </Badge>
              ))}
            </div>
            {movie.overview ? (
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                {movie.overview}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              <TrailerLink videoKey={trailer} title={movie.title} />
              <div className="space-y-1">
                <CrewLine label="Director" crew={directors} />
                <CrewLine label="Writer" crew={writers} />
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <CastSection cast={movie.credits?.cast ?? []} />
        <ProvidersSection providers={movie['watch/providers']?.results?.US} />
        <SimilarMovies movie={movie} />
      </Container>
    </main>
  )
}

function EntityNotFound() {
  return <NotFoundMessage label="Movie" />
}

function NotFoundMessage({ label }: { label: string }) {
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

function entityHead(
  seo?: { title: string; description: string; url: string; image?: string },
  jsonLd?: unknown,
) {
  return {
    meta: [
      { title: seo?.title ?? 'Movie | Vanta' },
      { name: 'description', content: seo?.description ?? 'Movie data powered by TMDB.' },
      { property: 'og:title', content: seo?.title ?? 'Movie | Vanta' },
      { property: 'og:description', content: seo?.description ?? 'Movie data powered by TMDB.' },
      ...(seo?.url ? [{ property: 'og:url', content: seo.url }] : []),
      ...(seo?.image ? [{ property: 'og:image', content: seo.image }] : []),
    ],
    links: seo?.url ? [{ rel: 'canonical', href: seo.url }] : [],
    scripts: jsonLd
      ? [{ type: 'application/ld+json', children: JSON.stringify(jsonLd) }]
      : [],
  }
}
