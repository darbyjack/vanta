import { createFileRoute } from '@tanstack/react-router'
import { Container } from '#/components/layout/Container'
import { Section } from '#/components/layout/Section'
import { DiscoveryRail } from '#/features/home/components/DiscoveryRail'
import { HomeSearch } from '#/features/home/components/HomeSearch'
import { getHomePageData } from '#/lib/tmdb/home.functions'

export const Route = createFileRoute('/')({
  loader: () => getHomePageData(),
  staleTime: 60 * 60 * 1000,
  head: () => ({
    meta: [
      { title: 'Vanta | Movies, TV, and people without the noise' },
      {
        name: 'description',
        content:
          'Fast lookup for movies, shows, people, ratings, credits, and streaming context from TMDB.',
      },
      {
        property: 'og:title',
        content: 'Vanta | Movies, TV, and people without the noise',
      },
      {
        property: 'og:description',
        content:
          'A fast, read-only TMDB reference for movies, TV shows, and people.',
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { trendingItems, popularItems, releaseItems } = Route.useLoaderData()
  const hasAnyItems =
    trendingItems.length || popularItems.length || releaseItems.length

  return (
    <main>
      <Container className="py-10 sm:py-14">
        <section className="mx-auto max-w-4xl py-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">
            TMDB reference
          </p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            Movies, shows, and people without the noise.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Fast lookup for what something is, who made it, who is in it,
            whether people like it, and where it is streaming.
          </p>
          <div className="mt-8">
            <HomeSearch />
          </div>
        </section>

        {trendingItems.length ? (
          <Section title="Trending Today">
            <DiscoveryRail items={trendingItems} />
          </Section>
        ) : null}

        {popularItems.length ? (
          <Section title="Popular Right Now">
            <DiscoveryRail items={popularItems} />
          </Section>
        ) : null}

        {releaseItems.length ? (
          <Section title="New Releases">
            <DiscoveryRail items={releaseItems} />
          </Section>
        ) : null}

        {!hasAnyItems ? (
          <section className="rounded-md border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Add a server-side <code>TMDB_API_KEY</code> to render discovery
            rails.
          </section>
        ) : null}
      </Container>
    </main>
  )
}
