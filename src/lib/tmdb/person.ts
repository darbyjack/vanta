import { cacheLife } from "next/cache";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import type { TmdbPersonDetail } from "@/lib/tmdb/types";

export async function getPerson(id: number) {
  "use cache";
  cacheLife({ stale: 86400, revalidate: 86400, expire: 172800 });

  try {
    return await tmdbFetch<TmdbPersonDetail>(`/person/${id}`, {
      append_to_response: "combined_credits",
    });
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes("TMDB_API_KEY")) return null;
    console.error(error);
    throw error;
  }
}
