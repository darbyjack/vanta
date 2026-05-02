import { cacheLife } from "next/cache";
import { z } from "zod";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { normalizeQuery } from "@/lib/url/slug";
import type { TmdbPage, TmdbSearchResult } from "@/lib/tmdb/types";

export const searchParamsSchema = z.object({
  q: z.string().optional().default("").transform(normalizeQuery),
  type: z.enum(["all", "movie", "tv", "person"]).optional().default("all"),
  page: z.coerce.number().int().positive().max(500).optional().default(1),
});

export type ParsedSearchParams = z.infer<typeof searchParamsSchema>;

export async function searchTmdb(query: string, type: ParsedSearchParams["type"], page: number) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 1800 });

  const normalized = normalizeQuery(query).toLowerCase();
  if (!normalized) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 } satisfies TmdbPage<TmdbSearchResult>;
  }

  const path = type === "all" ? "/search/multi" : `/search/${type}`;

  try {
    return (
      (await tmdbFetch<TmdbPage<TmdbSearchResult>>(path, {
        query: normalized,
        page,
        include_adult: false,
      })) ?? { page: 1, results: [], total_pages: 0, total_results: 0 }
    );
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes("TMDB_API_KEY")) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    console.error(error);
    throw error;
  }
}
