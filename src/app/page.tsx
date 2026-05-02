import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { DiscoveryRail } from "@/features/home/components/DiscoveryRail";
import { HomeSearch } from "@/features/home/components/HomeSearch";
import { isMediaCardItem, toMediaCard } from "@/lib/tmdb/normalize";
import { getNewReleases, getPopular, getTrending } from "@/lib/tmdb/trending";

export default async function HomePage() {
  const [trending, popular, newReleases] = await Promise.all([getTrending(), getPopular(), getNewReleases()]);
  const trendingItems = [
    ...trending.movies.map((item) => toMediaCard(item, "movie")),
    ...trending.tv.map((item) => toMediaCard(item, "tv")),
  ].filter(isMediaCardItem);
  const popularItems = [
    ...popular.movies.map((item) => toMediaCard(item, "movie")),
    ...popular.tv.map((item) => toMediaCard(item, "tv")),
  ].filter(isMediaCardItem);
  const releaseItems = [
    ...newReleases.movies.map((item) => toMediaCard(item, "movie")),
    ...newReleases.tv.map((item) => toMediaCard(item, "tv")),
  ].filter(isMediaCardItem);

  return (
    <Container className="py-10 sm:py-14">
      <section className="mx-auto max-w-4xl py-10 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">TMDB reference</p>
        <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">Movies, shows, and people without the noise.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Fast lookup for what something is, who made it, who is in it, whether people like it, and where it is streaming.
        </p>
        <div className="mt-8">
          <HomeSearch />
        </div>
      </section>

      {trendingItems.length ? (
        <Section title="Trending Today">
          <DiscoveryRail items={trendingItems.slice(0, 8)} />
        </Section>
      ) : null}
      {popularItems.length ? (
        <Section title="Popular Right Now">
          <DiscoveryRail items={popularItems.slice(0, 8)} />
        </Section>
      ) : null}
      {releaseItems.length ? (
        <Section title="New Releases">
          <DiscoveryRail items={releaseItems.slice(0, 8)} />
        </Section>
      ) : null}
    </Container>
  );
}
