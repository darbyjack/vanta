import { idSlug } from "@/lib/url/slug";
import type {
  MediaCardItem,
  TmdbCombinedCredit,
  TmdbMovieSummary,
  TmdbPersonSummary,
  TmdbSearchResult,
  TmdbTvSummary,
} from "@/lib/tmdb/types";

export function yearFrom(date?: string | null) {
  return date ? date.slice(0, 4) : undefined;
}

export function formatRuntime(minutes?: number | null) {
  if (!minutes) return undefined;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
}

export function formatDate(value?: string | null) {
  if (!value) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function compactNumber(value?: number) {
  if (!value) return undefined;
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function isMediaCardItem(item: MediaCardItem | null): item is MediaCardItem {
  return item !== null;
}

export function titleFor(item: TmdbMovieSummary | TmdbTvSummary | TmdbPersonSummary | TmdbCombinedCredit) {
  if ("title" in item && item.title) return item.title;
  if ("name" in item && item.name) return item.name;
  return "";
}

export function dateFor(item: TmdbMovieSummary | TmdbTvSummary) {
  return "title" in item ? item.release_date : item.first_air_date;
}

export function mediaHref(type: "movie" | "tv" | "person", id: number, title: string) {
  return `/${type}/${idSlug(id, title)}`;
}

export function toMediaCard(
  item: TmdbSearchResult | TmdbCombinedCredit,
  fallbackType?: "movie" | "tv" | "person",
): MediaCardItem | null {
  const type = item.media_type ?? fallbackType;
  if (!type || (type !== "movie" && type !== "tv" && type !== "person")) return null;
  const title = titleFor(item);
  if (!title) return null;

  if (type === "person") {
    const person = item as TmdbPersonSummary;
    return {
      id: item.id,
      type,
      title,
      subtitle: person.known_for_department,
      imagePath: person.profile_path,
      href: mediaHref(type, item.id, title),
    };
  }

  const media = item as TmdbMovieSummary | TmdbTvSummary;
  return {
    id: item.id,
    type,
    title,
    subtitle: yearFrom(dateFor(media)),
    imagePath: media.poster_path,
    backdropPath: media.backdrop_path,
    rating: media.vote_average,
    href: mediaHref(type, item.id, title),
  };
}

export function trimText(value: string | null | undefined, max = 160) {
  if (!value) return "";
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}...`;
}
