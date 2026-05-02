import { Badge } from '#/components/ui/Badge'
import { PosterImage } from '#/components/media/PosterImage'
import type { MediaCardItem } from '#/lib/tmdb/types'

export function MediaCard({ item }: { item: MediaCardItem }) {
  return (
    <a href={item.href} className="group block min-w-0 no-underline">
      <div className="overflow-hidden rounded-md border border-border bg-card transition-colors group-hover:border-primary/40">
        <PosterImage path={item.imagePath} alt={`${item.title} poster`} />
      </div>
      <div className="mt-2 min-w-0 space-y-1">
        <div className="truncate text-sm font-medium text-foreground group-hover:text-primary">
          {item.title}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge
            variant="secondary"
            className="h-5 rounded px-1.5 text-[10px] uppercase"
          >
            {item.type}
          </Badge>
          {item.subtitle ? <span className="truncate">{item.subtitle}</span> : null}
        </div>
      </div>
    </a>
  )
}
