import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '#/lib/utils'
import type { ParsedSearchParams } from '#/lib/tmdb/search'
import { searchHref } from '#/lib/tmdb/search-url'

const linkClass =
  'inline-flex h-9 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground no-underline transition hover:bg-secondary/80'

export function SearchPagination({
  params,
  totalPages,
}: {
  params: ParsedSearchParams
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const { page } = params
  const previousPage = Math.max(1, page - 1)
  const nextPage = Math.min(totalPages, page + 1)

  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      <a
        href={searchHref(params, { page: previousPage })}
        aria-disabled={page <= 1}
        className={cn(linkClass, page <= 1 && 'pointer-events-none opacity-50')}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </a>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <a
        href={searchHref(params, { page: nextPage })}
        aria-disabled={page >= totalPages}
        className={cn(linkClass, page >= totalPages && 'pointer-events-none opacity-50')}
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}
