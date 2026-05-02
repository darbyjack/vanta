import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HomeSearch() {
  return (
    <form action="/search" className="mx-auto flex w-full max-w-3xl gap-2">
      <label htmlFor="home-search" className="sr-only">
        Search movies, TV, and people
      </label>
      <Input
        id="home-search"
        name="q"
        type="search"
        maxLength={100}
        placeholder="Search movies, shows, people"
        className="h-12 border-border bg-card text-base"
      />
      <Button type="submit" className="h-12 px-4 sm:px-6">
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
