import { tmdbImage } from '#/lib/tmdb/images'

export function BackdropImage({
  path,
  alt,
}: {
  path: string | null | undefined
  alt: string
}) {
  const src = tmdbImage(path, 'w1280')

  return (
    <div className="absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover opacity-35"
          loading="eager"
          decoding="async"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
    </div>
  )
}
