export function EmptySearchState({ query }: { query?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">{query ? `No results found for "${query}"` : "Start with a title, show, or person"}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {query ? "Check the spelling or try a broader term." : "Search is server-rendered and works with plain links."}
      </p>
    </div>
  );
}
