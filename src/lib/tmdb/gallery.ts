import type { TmdbImageAsset, TmdbImages } from '#/lib/tmdb/types'

export interface GalleryImage extends TmdbImageAsset {
  kind: 'backdrop' | 'poster' | 'still'
  label: string
  alt: string
}

export function galleryImages(images?: TmdbImages, stillPath?: string | null) {
  const items: GalleryImage[] = []
  const add = (
    kind: GalleryImage['kind'],
    label: string,
    list?: TmdbImageAsset[],
  ) => {
    for (const image of list ?? []) {
      if (image.file_path) items.push({ ...image, kind, label, alt: label })
    }
  }

  add('backdrop', 'Backdrop', images?.backdrops)
  add('poster', 'Poster', images?.posters)
  add('still', 'Still', images?.stills)

  if (!items.length && stillPath) {
    items.push({
      aspect_ratio: 16 / 9,
      file_path: stillPath,
      height: 0,
      width: 0,
      vote_average: 0,
      vote_count: 0,
      kind: 'still',
      label: 'Still',
      alt: 'Episode still',
    })
  }

  return items
    .sort((a, b) => b.vote_count - a.vote_count || b.vote_average - a.vote_average)
    .slice(0, 12)
}
