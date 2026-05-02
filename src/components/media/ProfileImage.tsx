import Image from "next/image";
import { tmdbImage } from "@/lib/tmdb/images";

export function ProfileImage({ path, alt, priority = false }: { path: string | null | undefined; alt: string; priority?: boolean }) {
  const src = tmdbImage(path, "w500");
  if (!src) return <div className="aspect-[2/3] w-full rounded-md border border-border bg-muted" aria-label={alt} />;
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={750}
      priority={priority}
      className="aspect-[2/3] w-full rounded-md object-cover"
      sizes="(max-width: 768px) 45vw, 260px"
    />
  );
}
