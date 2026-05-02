import { tmdbImage } from '#/lib/tmdb/images'

export function PosterImage({
  path,
  alt,
  eager = false,
  size = 'w342',
}: {
  path: string | null | undefined
  alt: string
  eager?: boolean
  size?: 'w342' | 'w500'
}) {
  const src = tmdbImage(path, size)

  if (!src) {
    return (
      <div
        className="aspect-[2/3] w-full rounded-md border border-border bg-muted"
        aria-label={alt}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size === 'w500' ? 500 : 342}
      height={size === 'w500' ? 750 : 513}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="aspect-[2/3] w-full rounded-md object-cover"
      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 180px"
    />
  )
}
