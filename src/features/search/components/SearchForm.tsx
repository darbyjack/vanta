import { ChevronDown, Search } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import { Input } from '#/components/ui/Input'
import { cn } from '#/lib/utils'
import type { ParsedSearchParams } from '#/lib/tmdb/search'

const typeOptions = [
  ['all', 'All'],
  ['movie', 'Movies'],
  ['tv', 'TV'],
  ['person', 'People'],
] as const

export function SearchForm({ params }: { params: ParsedSearchParams }) {
  return (
    <form action="/search" className="space-y-2">
      <div className="flex rounded-md border border-input bg-card shadow-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40">
        <label htmlFor="search" className="sr-only">
          Search movies, TV, and people
        </label>
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search"
            name="q"
            type="search"
            defaultValue={params.q}
            maxLength={100}
            placeholder="Search movies, TV shows, or people..."
            className="h-14 border-0 bg-transparent pl-12 pr-3 text-lg focus-visible:border-transparent focus-visible:ring-0"
          />
        </div>
        <Button
          type="submit"
          className="m-1 h-12 rounded-sm px-4 sm:px-5"
          aria-label="Search"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-md border border-border bg-card/80 p-2">
        <fieldset className="min-w-0">
          <legend className="sr-only">Type</legend>
          <div className="flex h-10 rounded-md border border-input bg-background p-1">
            {typeOptions.map(([value, label]) => (
              <label
                key={value}
                className={cn(
                  'inline-flex cursor-pointer items-center justify-center rounded-sm px-3 text-sm font-medium text-muted-foreground transition hover:text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  params.type === value && 'bg-secondary text-foreground shadow-sm',
                )}
              >
                <input
                  type="radio"
                  name="type"
                  value={value}
                  defaultChecked={params.type === value}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="min-w-24 text-sm">
          <span className="sr-only">Year</span>
          <Input
            name="year"
            type="number"
            min="1874"
            max="2100"
            inputMode="numeric"
            placeholder="2020"
            defaultValue={params.year ?? ''}
            className="h-10 w-24 bg-background text-sm"
          />
        </label>

        <label className="min-w-40 text-sm">
          <span className="sr-only">Sort</span>
          <span className="relative block">
            <select
              name="sort"
              defaultValue={params.sort}
              className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm text-foreground outline-none transition hover:border-ring/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="release_date">Newest</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
        </label>
        {params.genre ? <input type="hidden" name="genre" value={params.genre} /> : null}
      </div>
    </form>
  )
}
