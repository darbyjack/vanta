import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-normal">
          Vanta
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search
        </Link>
      </Container>
    </header>
  );
}
