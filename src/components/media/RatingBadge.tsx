import { Star } from "lucide-react";

export function RatingBadge({ rating, votes }: { rating?: number; votes?: string }) {
  if (!rating) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      {rating.toFixed(1)}
      {votes ? <span className="text-muted-foreground">({votes})</span> : null}
    </span>
  );
}
