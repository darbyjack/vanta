import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchPagination({
  query,
  type,
  page,
  totalPages,
}: {
  query: string;
  type: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const base = `/search?q=${encodeURIComponent(query)}&type=${type}`;
  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      <Button asChild variant="secondary" aria-disabled={page <= 1}>
        <Link href={`${base}&page=${Math.max(1, page - 1)}`}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {Math.min(totalPages, 500)}
      </span>
      <Button asChild variant="secondary" aria-disabled={page >= totalPages}>
        <Link href={`${base}&page=${Math.min(totalPages, page + 1)}`}>
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
