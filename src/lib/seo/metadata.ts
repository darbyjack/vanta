import type { Metadata } from "next";
import { getEnv } from "@/lib/tmdb/env";
import { tmdbImage } from "@/lib/tmdb/images";
import { trimText } from "@/lib/tmdb/normalize";

interface EntityMetadataInput {
  title: string;
  description?: string | null;
  path: string;
  imagePath?: string | null;
}

export function absoluteUrl(path: string) {
  return new URL(path, getEnv().NEXT_PUBLIC_SITE_URL).toString();
}

export function entityMetadata({ title, description, path, imagePath }: EntityMetadataInput): Metadata {
  const text = trimText(description, 155) || "Movie, TV, and people data powered by TMDB.";
  const image = tmdbImage(imagePath, "w780") ?? undefined;
  const url = absoluteUrl(path);

  return {
    title,
    description: text,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: text,
      url,
      siteName: "Vanta",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: text,
      images: image ? [image] : undefined,
    },
  };
}
