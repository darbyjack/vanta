import { tmdbImage } from '#/lib/tmdb/images'

export function ProfileImage({
  path,
  alt,
  eager = false,
}: {
  path: string | null | undefined
  alt: string
  eager?: boolean
}) {
  const src = tmdbImage(path, 'w342')

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
      width={342}
      height={513}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="aspect-[2/3] w-full rounded-md object-cover"
    />
  )
}
