import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  ["all", "All"],
  ["movie", "Movies"],
  ["tv", "TV"],
  ["person", "People"],
] as const;

export function SearchTypeTabs({ query, active }: { query: string; active: string }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Search type">
      {tabs.map(([value, label]) => (
        <Link
          key={value}
          href={`/search?q=${encodeURIComponent(query)}&type=${value}`}
          className={cn(
            "rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground",
            active === value && "border-primary/40 bg-primary/10 text-primary",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
