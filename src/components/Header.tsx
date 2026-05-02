import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/86 px-4 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground no-underline"
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          Vanta
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="text-muted-foreground no-underline transition hover:text-foreground"
            activeProps={{ className: 'text-primary no-underline' }}
          >
            Home
          </Link>
          <a
            href="/search"
            className="text-muted-foreground no-underline transition hover:text-foreground"
          >
            Search
          </a>
        </div>
      </nav>
    </header>
  )
}
