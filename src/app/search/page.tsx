import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { MediaGrid } from "@/components/media/MediaGrid";
import { EmptySearchState } from "@/features/search/components/EmptySearchState";
import { SearchForm } from "@/features/search/components/SearchForm";
import { SearchPagination } from "@/features/search/components/SearchPagination";
import { SearchTypeTabs } from "@/features/search/components/SearchTypeTabs";
import { searchParamsSchema, searchTmdb } from "@/lib/tmdb/search";
import { isMediaCardItem, toMediaCard } from "@/lib/tmdb/normalize";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<Container className="min-h-[55vh] py-8" />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = searchParamsSchema.parse({
    q: Array.isArray(raw.q) ? raw.q[0] : raw.q,
    type: Array.isArray(raw.type) ? raw.type[0] : raw.type,
    page: Array.isArray(raw.page) ? raw.page[0] : raw.page,
  });
  const results = await searchTmdb(parsed.q, parsed.type, parsed.page);
  const items = results.results
    .map((item) => toMediaCard(item, parsed.type === "all" ? undefined : parsed.type))
    .filter(isMediaCardItem);

  return (
    <Container className="py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">Search</h1>
          <p className="mt-2 text-muted-foreground">Find movies, TV shows, and people from TMDB.</p>
        </div>
        <SearchForm query={parsed.q} type={parsed.type} />
        {parsed.q ? <SearchTypeTabs query={parsed.q} active={parsed.type} /> : null}
        {items.length ? (
          <>
            <MediaGrid items={items} />
            <SearchPagination query={parsed.q} type={parsed.type} page={parsed.page} totalPages={results.total_pages} />
          </>
        ) : (
          <EmptySearchState query={parsed.q || undefined} />
        )}
      </div>
    </Container>
  );
}
