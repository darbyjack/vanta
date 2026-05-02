import { Container } from "@/components/layout/Container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 py-8 text-sm text-muted-foreground">
      <Container className="space-y-2">
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        <a href="https://www.themoviedb.org" className="underline-offset-4 hover:text-foreground hover:underline">
          Data and images from The Movie Database.
        </a>
      </Container>
    </footer>
  );
}
