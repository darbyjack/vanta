import { cacheLife } from "next/cache";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import type { TmdbMovieSummary, TmdbPage, TmdbTvSummary } from "@/lib/tmdb/types";

async function safePage<T>(path: string, params = {}) {
  try {
    return (await tmdbFetch<TmdbPage<T>>(path, params))?.results ?? [];
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes("TMDB_API_KEY")) return [];
    console.error(error);
    return [];
  }
}

export async function getTrending() {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 7200, expire: 10800 });

  const [movies, tv] = await Promise.all([
    safePage<TmdbMovieSummary>("/trending/movie/day"),
    safePage<TmdbTvSummary>("/trending/tv/day"),
  ]);

  return { movies, tv };
}

export async function getPopular() {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 7200, expire: 10800 });

  const [movies, tv] = await Promise.all([
    safePage<TmdbMovieSummary>("/movie/popular"),
    safePage<TmdbTvSummary>("/tv/popular"),
  ]);

  return { movies, tv };
}

export async function getNewReleases() {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 10800, expire: 21600 });

  const today = new Date().toISOString().slice(0, 10);
  const [movies, tv] = await Promise.all([
    safePage<TmdbMovieSummary>("/movie/now_playing"),
    safePage<TmdbTvSummary>("/discover/tv", {
      sort_by: "first_air_date.desc",
      "first_air_date.lte": today,
      include_null_first_air_dates: false,
    }),
  ]);

  return { movies, tv };
}
