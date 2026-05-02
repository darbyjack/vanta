import Image from "next/image";
import { tmdbImage } from "@/lib/tmdb/images";

export function BackdropImage({ path, alt }: { path: string | null | undefined; alt: string }) {
  const src = tmdbImage(path, "w1280");
  if (!src) return null;
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Image src={src} alt={alt} fill priority className="object-cover opacity-25" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/82 to-background" />
    </div>
  );
}
