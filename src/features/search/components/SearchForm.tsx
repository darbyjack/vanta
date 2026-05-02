import { Search } from 'lucide-react'
import { Button } from '#/components/ui/Button'
import { Input } from '#/components/ui/Input'

export function SearchForm({ query, type }: { query: string; type: string }) {
  return (
    <form action="/search" className="flex gap-2">
      <label htmlFor="search" className="sr-only">
        Search movies, TV, and people
      </label>
      <Input
        id="search"
        name="q"
        type="search"
        defaultValue={query}
        maxLength={100}
        className="h-11"
      />
      <input type="hidden" name="type" value={type} />
      <Button type="submit" className="h-11">
        <Search className="h-4 w-4" aria-hidden="true" />
        Search
      </Button>
    </form>
  )
}
