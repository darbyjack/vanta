import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { BackdropImage } from "@/components/media/BackdropImage";
import { PosterImage } from "@/components/media/PosterImage";
import { RatingBadge } from "@/components/media/RatingBadge";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { TrailerDialog } from "@/features/movie/components/TrailerDialog";
import { CastSection, CrewLine, pickTrailer, ProvidersSection, SimilarMovies } from "@/features/movie/components/DetailSections";
import { absoluteUrl, entityMetadata } from "@/lib/seo/metadata";
import { movieJsonLd } from "@/lib/seo/jsonld";
import { getMovie } from "@/lib/tmdb/movie";
import { compactNumber, formatRuntime, yearFrom } from "@/lib/tmdb/normalize";
import { idSlug, parseLeadingId } from "@/lib/url/slug";

async function loadMovie(slug: string) {
  const id = parseLeadingId(slug);
  if (!id) notFound();
  const movie = await getMovie(id);
  if (!movie) notFound();
  const canonicalSlug = idSlug(movie.id, movie.title);
  return { movie, canonicalSlug };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { movie, canonicalSlug } = await loadMovie(slug);
  return entityMetadata({
    title: movie.title,
    description: movie.overview,
    path: `/movie/${canonicalSlug}`,
    imagePath: movie.backdrop_path ?? movie.poster_path,
  });
}

export default function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Container className="min-h-[70vh] py-10" />}>
      <MovieContent params={params} />
    </Suspense>
  );
}

async function MovieContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { movie, canonicalSlug } = await loadMovie(slug);
  if (slug !== canonicalSlug) permanentRedirect(`/movie/${canonicalSlug}`);

  const directors = movie.credits?.crew.filter((person) => person.job === "Director") ?? [];
  const writers = movie.credits?.crew.filter((person) => ["Writer", "Screenplay", "Story"].includes(person.job ?? "")) ?? [];
  const trailer = pickTrailer(movie.videos);
  const url = absoluteUrl(`/movie/${canonicalSlug}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd(movie, url)) }} />
      <div className="relative">
        <BackdropImage path={movie.backdrop_path} alt={`${movie.title} backdrop`} />
        <Container className="grid gap-8 py-10 md:grid-cols-[220px_1fr] lg:py-16">
          <div className="max-w-[220px]">
            <PosterImage path={movie.poster_path} alt={`${movie.title} poster`} priority size="w500" />
          </div>
          <div className="max-w-3xl self-end">
            <h1 className="text-4xl font-semibold tracking-normal">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {yearFrom(movie.release_date) ? <span>{yearFrom(movie.release_date)}</span> : null}
              {formatRuntime(movie.runtime) ? <span>{formatRuntime(movie.runtime)}</span> : null}
              <RatingBadge rating={movie.vote_average} votes={compactNumber(movie.vote_count)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary" className="rounded">
                  {genre.name}
                </Badge>
              ))}
            </div>
            {movie.overview ? <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{movie.overview}</p> : null}
            <div className="mt-6 flex flex-wrap gap-4">
              <TrailerDialog videoKey={trailer} title={movie.title} />
              <div className="space-y-1">
                <CrewLine label="Director" crew={directors} />
                <CrewLine label="Writer" crew={writers} />
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <CastSection cast={movie.credits?.cast ?? []} />
        <ProvidersSection providers={movie["watch/providers"]?.results?.US} />
        <SimilarMovies movie={movie} />
      </Container>
    </>
  );
}
