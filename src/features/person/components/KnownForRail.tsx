import { MediaGrid } from "@/components/media/MediaGrid";
import { isMediaCardItem, toMediaCard } from "@/lib/tmdb/normalize";
import type { TmdbCombinedCredit } from "@/lib/tmdb/types";

export function KnownForRail({ credits }: { credits: TmdbCombinedCredit[] }) {
  const items = credits
    .filter((credit) => credit.poster_path && (credit.vote_average ?? 0) > 0)
    .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
    .map((credit) => toMediaCard(credit, credit.media_type))
    .filter(isMediaCardItem)
    .slice(0, 12);

  if (!items.length) return null;
  return (
    <section className="py-8">
      <h2 className="mb-4 text-xl font-semibold">Known For</h2>
      <MediaGrid items={items} />
    </section>
  );
}
