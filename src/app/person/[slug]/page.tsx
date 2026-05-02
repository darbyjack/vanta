import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { ProfileImage } from "@/components/media/ProfileImage";
import { Badge } from "@/components/ui/badge";
import { KnownForRail } from "@/features/person/components/KnownForRail";
import { PersonFilmography } from "@/features/person/components/PersonFilmography";
import { absoluteUrl, entityMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/jsonld";
import { getPerson } from "@/lib/tmdb/person";
import { formatDate } from "@/lib/tmdb/normalize";
import { idSlug, parseLeadingId } from "@/lib/url/slug";

async function loadPerson(slug: string) {
  const id = parseLeadingId(slug);
  if (!id) notFound();
  const person = await getPerson(id);
  if (!person) notFound();
  const canonicalSlug = idSlug(person.id, person.name);
  return { person, canonicalSlug };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { person, canonicalSlug } = await loadPerson(slug);
  return entityMetadata({
    title: person.name,
    description: person.biography,
    path: `/person/${canonicalSlug}`,
    imagePath: person.profile_path,
  });
}

export default function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Container className="min-h-[70vh] py-10" />}>
      <PersonContent params={params} />
    </Suspense>
  );
}

async function PersonContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { person, canonicalSlug } = await loadPerson(slug);
  if (slug !== canonicalSlug) permanentRedirect(`/person/${canonicalSlug}`);
  const credits = [...(person.combined_credits?.cast ?? []), ...(person.combined_credits?.crew ?? [])];
  const url = absoluteUrl(`/person/${canonicalSlug}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(person, url)) }} />
      <Container className="grid gap-8 py-10 md:grid-cols-[260px_1fr] lg:py-16">
        <div className="max-w-[260px]">
          <ProfileImage path={person.profile_path} alt={person.name} priority />
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-normal">{person.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {person.known_for_department ? (
              <Badge variant="secondary" className="rounded">
                {person.known_for_department}
              </Badge>
            ) : null}
            {person.birthday ? <Badge variant="outline" className="rounded">Born {formatDate(person.birthday)}</Badge> : null}
            {person.deathday ? <Badge variant="outline" className="rounded">Died {formatDate(person.deathday)}</Badge> : null}
          </div>
          {person.place_of_birth ? <p className="mt-3 text-sm text-muted-foreground">{person.place_of_birth}</p> : null}
          {person.biography ? <p className="mt-6 max-w-3xl whitespace-pre-line leading-7 text-muted-foreground">{person.biography}</p> : null}
        </div>
      </Container>
      <Container>
        <KnownForRail credits={credits} />
        <PersonFilmography credits={credits} />
      </Container>
    </>
  );
}
