import { MediaGrid } from '#/components/media/MediaGrid'
import type { MediaCardItem } from '#/lib/tmdb/types'
import { galleryImages } from '#/lib/tmdb/gallery'
import { tmdbImage } from '#/lib/tmdb/images'
import { mediaHref } from '#/lib/tmdb/normalize'
import { providerAvailabilityGroups } from '#/lib/tmdb/provider-availability'
import type {
  TmdbCredit,
  TmdbImages,
  TmdbProvider,
  TmdbWatchProviders,
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
  providers?: NonNullable<TmdbWatchProviders['results']>[string]
}) {
  const groups = providerAvailabilityGroups(providers)
  if (!groups.length) return null
  const providerLink = providers?.link

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Where to Watch</h2>
      <div className="space-y-4 rounded-md border border-border bg-card p-4">
        {groups.map((group) => (
          <div key={group.key}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.providers.map((provider) => (
                <ProviderLogo
                  key={provider.provider_id}
                  provider={provider}
                  href={providerLink}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProviderLogo({
  provider,
  href,
}: {
  provider: TmdbProvider
  href?: string
}) {
  const logo = tmdbImage(provider.logo_path, 'w92')
  const content = (
    <>
      {logo ? (
        <img
          src={logo}
          alt=""
          className="h-8 w-8 rounded object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="h-8 w-8 rounded bg-muted" aria-hidden="true" />
      )}
      <span className="max-w-28 truncate">{provider.provider_name}</span>
    </>
  )
  const className =
    'inline-flex h-11 max-w-40 items-center gap-2 rounded-md border border-border bg-secondary px-2 text-xs text-secondary-foreground no-underline transition hover:border-primary/40'

  if (href) {
    return (
      <a href={href} className={className} title={provider.provider_name}>
        {content}
      </a>
    )
  }

  return (
    <span className={className} title={provider.provider_name}>
      {content}
    </span>
  )
}

export function GallerySection({
  images,
  stillPath,
}: {
  images?: TmdbImages
  stillPath?: string | null
}) {
  const gallery = galleryImages(images, stillPath)
  if (!gallery.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Gallery</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((image, index) => {
          const thumb = tmdbImage(image.file_path, image.kind === 'poster' ? 'w342' : 'w500')
          const full = tmdbImage(image.file_path, 'w1280')
          if (!thumb || !full) return null

          return (
            <div key={`${image.kind}-${image.file_path}`}>
              <a
                href={`#gallery-${index}`}
                className="group block overflow-hidden rounded-md border border-border bg-card no-underline hover:border-primary/40"
              >
                <img
                  src={thumb}
                  alt={image.alt}
                  className="aspect-video w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
                <span className="block truncate px-2 py-1.5 text-xs text-muted-foreground">
                  {image.label}
                </span>
              </a>
              <div
                id={`gallery-${index}`}
                className="fixed inset-0 z-50 hidden bg-background/95 p-4 target:grid target:place-items-center"
              >
                <a
                  href="#gallery"
                  className="absolute right-4 top-4 rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground no-underline"
                >
                  Close
                </a>
                <img
                  src={full}
                  alt={image.alt}
                  className="max-h-[86vh] max-w-full rounded-md object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function RecommendationsSection({ items }: { items: MediaCardItem[] }) {
  if (!items.length) return null

  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Recommended Titles</h2>
      <MediaGrid items={items} />
    </section>
  )
}
