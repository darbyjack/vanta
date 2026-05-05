import { Badge } from '#/components/ui/Badge'
import { MediaGrid } from '#/components/media/MediaGrid'
import { tmdbImage } from '#/lib/tmdb/images'
import {
  isMediaCardItem,
  mediaHref,
  toMediaCard,
} from '#/lib/tmdb/normalize'
import type {
  TmdbCredit,
  TmdbMovieDetail,
  TmdbProvider,
  TmdbTvDetail,
} from '#/lib/tmdb/types'

export function pickTrailer(videos?: {
  results: { key: string; site: string; type: string; official: boolean }[]
}) {
  return videos?.results.find(
    (video) =>
      video.site === 'YouTube' && video.type === 'Trailer' && video.official,
  )?.key
}

export function TrailerLink({
  videoKey,
  title,
}: {
  videoKey?: string
  title: string
}) {
  if (!videoKey) return null

  return (
    <a
      href={`https://www.youtube-nocookie.com/embed/${videoKey}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground no-underline transition hover:bg-primary/90"
    >
      {title} trailer
    </a>
  )
}

export function CrewLine({ label, crew }: { label: string; crew: TmdbCredit[] }) {
  if (!crew.length) return null

  return (
    <p className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      {crew.slice(0, 4).map((person, index) => (
        <span key={`${person.id}-${person.job ?? person.name}`}>
          {index ? ', ' : ''}
          <a href={mediaHref('person', person.id, person.name)} className="hover:text-primary">
            {person.name}
          </a>
        </span>
      ))}
    </p>
  )
}

export function CastSection({
  cast,
  title = 'Top Cast',
  limit = 12,
}: {
  cast: TmdbCredit[]
  title?: string
  limit?: number
}) {
  const topCast = cast.slice(0, limit)
  if (!topCast.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {topCast.map((person) => {
          const image = tmdbImage(person.profile_path, 'w185')

          return (
            <a
              key={`${person.id}-${person.character ?? person.name}`}
              href={mediaHref('person', person.id, person.name)}
              className="flex gap-3 rounded-md border border-border bg-card p-2 no-underline hover:border-primary/40"
            >
              {image ? (
                <img
                  src={image}
                  alt={person.name}
                  className="h-14 w-10 rounded object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="h-14 w-10 rounded bg-muted" />
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {person.name}
                </span>
                {person.character ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    {person.character}
                  </span>
                ) : null}
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export function ProvidersSection({
  providers,
}: {
  providers?: {
    link?: string
    flatrate?: TmdbProvider[]
    rent?: TmdbProvider[]
    buy?: TmdbProvider[]
  }
}) {
  if (!providers || (!providers.flatrate?.length && !providers.rent?.length && !providers.buy?.length)) {
    return null
  }

  const groups = [
    ['Stream', providers.flatrate],
    ['Rent', providers.rent],
    ['Buy', providers.buy],
  ] as const

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Where to Watch</h2>
      <div className="space-y-4 rounded-md border border-border bg-card p-4">
        {groups.map(([label, list]) =>
          list?.length ? (
            <div key={label}>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                {label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {list.slice(0, 8).map((provider) => (
                  <Badge key={provider.provider_id} variant="secondary" className="rounded">
                    {provider.provider_name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null,
        )}
        {providers.link ? (
          <a href={providers.link} className="inline-block text-sm text-primary underline-offset-4 hover:underline">
            View availability on TMDB
          </a>
        ) : null}
      </div>
    </section>
  )
}

export function SimilarMovies({ movie }: { movie: TmdbMovieDetail }) {
  const items =
    movie.similar?.results
      .map((item) => toMediaCard(item, 'movie'))
      .filter(isMediaCardItem)
      .slice(0, 12) ?? []

  if (!items.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Similar Titles</h2>
      <MediaGrid items={items} />
    </section>
  )
}

export function SimilarTv({ tv }: { tv: TmdbTvDetail }) {
  const items =
    tv.similar?.results
      .map((item) => toMediaCard(item, 'tv'))
      .filter(isMediaCardItem)
      .slice(0, 12) ?? []

  if (!items.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Similar Titles</h2>
      <MediaGrid items={items} />
    </section>
  )
}
