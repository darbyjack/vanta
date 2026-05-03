import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { Badge } from '#/components/ui/Badge'
import { Container } from '#/components/layout/Container'
import { ProfileImage } from '#/components/media/ProfileImage'
import { KnownForRail } from '#/features/person/components/KnownForRail'
import { PersonFilmography } from '#/features/person/components/PersonFilmography'
import { guardedPageHandlers } from '#/lib/bots/server-route'
import { getPersonPageData } from '#/lib/tmdb/entity.functions'
import { formatDate } from '#/lib/tmdb/normalize'
import { parseLeadingId } from '#/lib/url/slug'

export const Route = createFileRoute('/person/$slug')({
  server: {
    handlers: guardedPageHandlers(),
  },
  loader: async ({ params }) => {
    const id = parseLeadingId(params.slug)
    if (!id) throw notFound()

    const data = await getPersonPageData({ data: { id } })
    if (!data) throw notFound()
    if (params.slug !== data.canonicalSlug) {
      throw redirect({ to: '/person/$slug', params: { slug: data.canonicalSlug } })
    }

    return data
  },
  preload: false,
  staleTime: 24 * 60 * 60 * 1000,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.seo.title ?? 'Person | Vanta' },
      { name: 'description', content: loaderData?.seo.description ?? 'Person data powered by TMDB.' },
      { property: 'og:title', content: loaderData?.seo.title ?? 'Person | Vanta' },
      { property: 'og:description', content: loaderData?.seo.description ?? 'Person data powered by TMDB.' },
      ...(loaderData?.seo.url ? [{ property: 'og:url', content: loaderData.seo.url }] : []),
      ...(loaderData?.seo.image ? [{ property: 'og:image', content: loaderData.seo.image }] : []),
    ],
    links: loaderData?.seo.url ? [{ rel: 'canonical', href: loaderData.seo.url }] : [],
    scripts: loaderData?.jsonLd
      ? [{ type: 'application/ld+json', children: JSON.stringify(loaderData.jsonLd) }]
      : [],
  }),
  component: PersonPage,
  notFoundComponent: () => <EntityNotFound label="Person" />,
})

function PersonPage() {
  const { person } = Route.useLoaderData()
  const credits = [
    ...(person.combined_credits?.cast ?? []),
    ...(person.combined_credits?.crew ?? []),
  ]

  return (
    <main>
      <Container className="grid gap-8 py-10 md:grid-cols-[260px_1fr] lg:py-16">
        <div className="max-w-[260px]">
          <ProfileImage path={person.profile_path} alt={person.name} eager />
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-normal">{person.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {person.known_for_department ? (
              <Badge variant="secondary" className="rounded">
                {person.known_for_department}
              </Badge>
            ) : null}
            {person.birthday ? (
              <Badge variant="outline" className="rounded">
                Born {formatDate(person.birthday)}
              </Badge>
            ) : null}
            {person.deathday ? (
              <Badge variant="outline" className="rounded">
                Died {formatDate(person.deathday)}
              </Badge>
            ) : null}
          </div>
          {person.place_of_birth ? (
            <p className="mt-3 text-sm text-muted-foreground">{person.place_of_birth}</p>
          ) : null}
          {person.biography ? (
            <p className="mt-6 max-w-3xl whitespace-pre-line leading-7 text-muted-foreground">
              {person.biography}
            </p>
          ) : null}
        </div>
      </Container>
      <Container>
        <KnownForRail credits={credits} />
        <PersonFilmography credits={credits} />
      </Container>
    </main>
  )
}

function EntityNotFound({ label }: { label: string }) {
  return (
    <Container className="py-16">
      <div className="rounded-md border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">{label} not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The TMDB item may not exist, or the server-side TMDB key is missing.
        </p>
      </div>
    </Container>
  )
}
