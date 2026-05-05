# Vanta

Vanta is a fast, read-only TMDB explorer for movies, TV shows, seasons, episodes, and people.

It is built for server-rendered reference pages, clean URL-based navigation, SEO metadata, and Cloudflare edge caching. There are no accounts, tracking flows, or user-owned data.

## Stack

- TanStack Start
- TanStack Router
- Cloudflare Workers
- Vite
- Tailwind CSS v4
- React 19
- pnpm
- TMDB API

## Features

- Movie pages
- TV pages
- Season and episode pages
- Episode cast and crew
- Person pages
- Search with URL-based state and server-side filters
- Grouped streaming provider information
- Entity image galleries
- SEO metadata and canonical URLs
- Cloudflare edge caching
- Bot and crawler controls for expensive TMDB-backed routes

## Requirements

- Node.js LTS
- pnpm
- TMDB API key

## Environment Variables

Create a local `.env` file with:

```env
TMDB_API_KEY=your_tmdb_api_key
SITE_URL=http://localhost:3000
```

`TMDB_API_KEY` must remain server-only. Do not expose it with a public client-side prefix.

For deployed environments, configure both values as platform secrets or environment variables.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm deploy
```

## Routes

- `/`
- `/search`
- `/movie/[id]-[slug]`
- `/tv/[id]-[slug]`
- `/tv/[id]-[slug]/season/[seasonNumber]`
- `/tv/[id]-[slug]/season/[seasonNumber]/episode/[episodeNumber]`
- `/person/[id]-[slug]`
- `/robots.txt`
- `/sitemap.xml`

Entity IDs are the source of truth. Slugs are cosmetic and should redirect to the canonical slug when needed.

## Providers

Movie and TV pages render US streaming availability from TMDB watch provider data. Providers are grouped as Stream, Rent, and Buy, empty groups are omitted, and provider logos link to TMDB availability when TMDB returns a provider link.

## Galleries

Movie, TV, and episode pages can render compact image galleries from TMDB image data. Gallery images are loaded with the page data on the server, shown in a small lazy-loaded grid, and opened with a lightweight in-page lightbox. Empty galleries are omitted.

## Search Filters

Search is driven entirely by URL params:

```txt
/search?q=batman&type=movie&year=2008&sort=rating
```

Supported params are `q`, `type`, `page`, `year`, `sort`, and `genre`. Unfiltered text search uses TMDB search endpoints. Filtered movie and TV searches use TMDB discover endpoints server-side; the page still renders without client-side TMDB requests.

## Caching

Vanta uses HTTP response headers as its primary cache layer on Cloudflare:

| Area | Cache behavior |
| --- | --- |
| Home | Short browser cache, longer shared cache |
| Search | Brief shared cache for query pages |
| Entity pages | Longer shared cache with stale-while-revalidate |
| Static server routes | Cached robots and sitemap responses |
| Built assets | Served directly as Cloudflare static assets |

Deploys keep old hashed assets briefly so cached HTML can continue loading the CSS and JavaScript from the build that produced it.

## TMDB Attribution

This product uses the TMDB API but is not endorsed, certified, or otherwise approved by TMDB.

## License

License not yet specified.
