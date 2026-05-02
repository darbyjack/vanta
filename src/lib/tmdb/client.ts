import { getEnv, hasTmdbKey } from "@/lib/tmdb/env";

const BASE_URL = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (!hasTmdbKey()) {
    throw new TmdbError("TMDB_API_KEY is not configured.");
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  const token = getEnv().TMDB_API_KEY!;
  const isBearerToken = token.startsWith("eyJ");
  if (!isBearerToken) url.searchParams.set("api_key", token);

  const response = await fetch(url, {
    headers: {
      ...(isBearerToken ? { Authorization: `Bearer ${token}` } : {}),
      Accept: "application/json",
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new TmdbError(`TMDB request failed: ${path}`, response.status);
  }

  return (await response.json()) as T;
}
