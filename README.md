# Vanta

Vanta is a read-only, SEO-first movie and TV reference app backed by TMDB. It has no auth, database, analytics, or user-owned state.

## Stack

- TanStack Start and TanStack Router
- TanStack Query SSR integration, kept for progressive use rather than core page data
- React 19
- Vite
- Tailwind CSS v4
- Cloudflare Workers
- pnpm
- TMDB API

## Commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run test
pnpm run deploy
pnpm run cf:preview
```

`pnpm run deploy` and `pnpm run cf:deploy` both build and deploy with Wrangler. Deploys keep old hashed assets for 7 days with `--old-asset-ttl 604800` so cached HTML can still load CSS and JS from the previous build during rollover.

## Environment

Required for TMDB-backed pages:

```bash
TMDB_API_KEY=<tmdb api key or v4 bearer token>
SITE_URL=http://localhost:3000
```

Do not prefix `TMDB_API_KEY` with `VITE_`. It must stay server-only.

For Cloudflare Workers, set secrets with Wrangler:

```bash
npx wrangler secret put TMDB_API_KEY
npx wrangler secret put SITE_URL
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

Entity route IDs are the source of truth. Slugs are cosmetic and redirect to the canonical slug when needed.

## Data And Caching

Core TMDB page data comes from TanStack route loaders calling `createServerFn` wrappers. TMDB secrets stay inside server-only helpers, and the app does not use client-side TMDB fetching or an internal TMDB cache.

Cloudflare-facing HTTP headers are the primary cache layer:

| Policy | Routes | Cache-Control |
| --- | --- | --- |
| HOME | `/` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=7200` |
| SEARCH | `/search` | `public, max-age=60, s-maxage=600, stale-while-revalidate=1800` |
| ENTITY | movie, TV, person, season, episode | `public, max-age=300, s-maxage=86400, stale-while-revalidate=604800` |
| STATIC | sitemap | `public, max-age=3600, s-maxage=86400` |
| ROBOTS | robots | `public, max-age=300, s-maxage=3600` |

`CDN-Cache-Control` is also emitted for Cloudflare. Non-production responses include `x-vanta-cache-policy` and `x-vanta-route-kind`; production responses omit those debug headers.

## Crawler Controls

`robots.txt` blocks common AI crawlers, including Anthropic, OpenAI, Perplexity, Google-Extended, CCBot, Bytespider, and Applebot-Extended agents. Normal search engines such as Googlebot and Bingbot are still allowed.

TMDB requests also check blocked AI crawler user agents in `src/lib/tmdb/client.server.ts` and return `403` before calling TMDB. Relax or expand the policy in `src/lib/bots/policy.ts`.

Inspect live Worker logs with:

```bash
pnpm wrangler tail --format json
```

## Header Checks

After deploying, verify headers with:

```bash
curl -I https://your-domain.com/
curl -I "https://your-domain.com/search?q=batman"
curl -I https://your-domain.com/tv/1399-game-of-thrones
curl -I https://your-domain.com/tv/1399-game-of-thrones/season/1
curl -I https://your-domain.com/tv/1399-game-of-thrones/season/1/episode/1
curl -I https://your-domain.com/assets/<built-css-file>.css
curl -I -A "ClaudeBot" https://your-domain.com/
curl -I -A "Mozilla/5.0" https://your-domain.com/
```

Expected:

- `Cache-Control` is present
- `CDN-Cache-Control` is present
- no `Set-Cookie`
- `CF-Cache-Status` appears on Cloudflare
- debug headers only appear outside production
- blocked AI crawler UAs receive `403`
- normal browser UAs receive `200`

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
