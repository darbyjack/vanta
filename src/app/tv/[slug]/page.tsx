import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { BackdropImage } from "@/components/media/BackdropImage";
import { PosterImage } from "@/components/media/PosterImage";
import { RatingBadge } from "@/components/media/RatingBadge";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { TrailerDialog } from "@/features/movie/components/TrailerDialog";
import { CastSection, CrewLine, pickTrailer, ProvidersSection, SimilarTv } from "@/features/movie/components/DetailSections";
import { absoluteUrl, entityMetadata } from "@/lib/seo/metadata";
import { tvJsonLd } from "@/lib/seo/jsonld";
import { getTv } from "@/lib/tmdb/tv";
import { compactNumber, formatDate, yearFrom } from "@/lib/tmdb/normalize";
import { idSlug, parseLeadingId } from "@/lib/url/slug";

async function loadTv(slug: string) {
  const id = parseLeadingId(slug);
  if (!id) notFound();
  const tv = await getTv(id);
  if (!tv) notFound();
  const canonicalSlug = idSlug(tv.id, tv.name);
  return { tv, canonicalSlug };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { tv, canonicalSlug } = await loadTv(slug);
  return entityMetadata({
    title: tv.name,
    description: tv.overview,
    path: `/tv/${canonicalSlug}`,
    imagePath: tv.backdrop_path ?? tv.poster_path,
  });
}

export default function TvPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Container className="min-h-[70vh] py-10" />}>
      <TvContent params={params} />
    </Suspense>
  );
}

async function TvContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { tv, canonicalSlug } = await loadTv(slug);
  if (slug !== canonicalSlug) permanentRedirect(`/tv/${canonicalSlug}`);

  const creators = tv.created_by ?? [];
  const trailer = pickTrailer(tv.videos);
  const url = absoluteUrl(`/tv/${canonicalSlug}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd(tv, url)) }} />
      <div className="relative">
        <BackdropImage path={tv.backdrop_path} alt={`${tv.name} backdrop`} />
        <Container className="grid gap-8 py-10 md:grid-cols-[220px_1fr] lg:py-16">
          <div className="max-w-[220px]">
            <PosterImage path={tv.poster_path} alt={`${tv.name} poster`} priority size="w500" />
          </div>
          <div className="max-w-3xl self-end">
            <h1 className="text-4xl font-semibold tracking-normal">{tv.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {yearFrom(tv.first_air_date) ? <span>{yearFrom(tv.first_air_date)}</span> : null}
              {tv.status ? <span>{tv.status}</span> : null}
              <span>{tv.number_of_seasons} seasons</span>
              <span>{tv.number_of_episodes} episodes</span>
              <RatingBadge rating={tv.vote_average} votes={compactNumber(tv.vote_count)} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tv.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary" className="rounded">
                  {genre.name}
                </Badge>
              ))}
            </div>
            {tv.overview ? <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{tv.overview}</p> : null}
            <div className="mt-6 flex flex-wrap gap-4">
              <TrailerDialog videoKey={trailer} title={tv.name} />
              <div className="space-y-1 text-sm">
                <CrewLine label="Creator" crew={creators} />
                {tv.last_air_date ? <p><span className="text-muted-foreground">Last aired: </span>{formatDate(tv.last_air_date)}</p> : null}
                {tv.next_episode_to_air?.air_date ? <p><span className="text-muted-foreground">Next: </span>{formatDate(tv.next_episode_to_air.air_date)}</p> : null}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Container>
        <CastSection cast={tv.credits?.cast ?? []} />
        <ProvidersSection providers={tv["watch/providers"]?.results?.US} />
        <SimilarTv tv={tv} />
      </Container>
    </>
  );
}
