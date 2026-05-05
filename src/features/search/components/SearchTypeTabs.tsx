import { cn } from '#/lib/utils'
import type { ParsedSearchParams } from '#/lib/tmdb/search'
import { searchHref } from '#/lib/tmdb/search-url'

const tabs = [
  ['all', 'All'],
  ['movie', 'Movies'],
  ['tv', 'TV'],
  ['person', 'People'],
] as const

export function SearchTypeTabs({
  params,
}: {
  params: ParsedSearchParams
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Search type">
      {tabs.map(([value, label]) => (
        <a
          key={value}
          href={searchHref(params, { type: value, page: 1 })}
          className={cn(
            'rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground no-underline transition hover:text-foreground',
            params.type === value && 'border-primary/40 bg-primary/10 text-primary',
          )}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
