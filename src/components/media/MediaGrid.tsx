import { MediaCard } from '#/components/media/MediaCard'
import type { MediaCardItem } from '#/lib/tmdb/types'

export function MediaGrid({ items }: { items: MediaCardItem[] }) {
  if (!items.length) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  )
}
