<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Vanta Start Migration Notes

## Bootstrap Commands Used

Run from `C:\Users\Glare\Documents\Projects\vanta`:

```bash
npx @tanstack/cli@latest create vanta-start --agent --deployment cloudflare --add-ons tanstack-query
```

Run from `C:\Users\Glare\Documents\Projects\vanta\vanta-start`:

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
```

Run from `C:\Users\Glare\Documents\Projects\vanta`:

```bash
git clone --depth 1 https://github.com/darbyjack/vanta legacy-source
Remove-Item -LiteralPath legacy-source\.git -Recurse -Force
```

The legacy repo is a read-only reference at `C:\Users\Glare\Documents\Projects\vanta\legacy-source`. Do not copy its `.git` directory into this app and do not overwrite scaffolded files wholesale.

## TanStack Intent Skills

Use TanStack Intent skills as the primary source of truth before changing Start, Router, loader, search-param, server-function, SSR, or Cloudflare deployment code.

Useful skills reported by `npx @tanstack/intent@latest list`:

- `@tanstack/react-start#react-start`
- `@tanstack/start-client-core#start-core`
- `@tanstack/start-client-core#start-core/server-functions`
- `@tanstack/start-client-core#start-core/execution-model`
- `@tanstack/start-client-core#start-core/deployment`
- `@tanstack/router-core#router-core`
- `@tanstack/router-core#router-core/data-loading`
- `@tanstack/router-core#router-core/path-params`
- `@tanstack/router-core#router-core/search-params`
- `@tanstack/router-core#router-core/ssr`

Load a skill with:

```bash
npx @tanstack/intent@latest load <package>#<skill>
```

## Product Context

Vanta is a read-only, SEO-first movie and TV reference app backed by TMDB.

- No authentication.
- No database.
- No user state.
- No analytics.
- Server-first rendering.
- Cloudflare Workers deployment.
- Minimal client JavaScript.
- URL-based state for search and filters.
- Feature-scoped components.

## Migration Strategy

Migrate incrementally, route by route, preserving the legacy UX, layout, URL shape, and TMDB data behavior.

Legacy routes to preserve:

- `/`
- `/search`
- `/movie/[id]-[slug]`
- `/tv/[id]-[slug]`
- `/person/[id]-[slug]`
- `/robots.txt`
- `/sitemap.xml`

TanStack routing notes:

- Replace Next.js `src/app/layout.tsx` with TanStack root route behavior in `src/routes/__root.tsx`.
- Replace Next.js `page.tsx` files with TanStack file routes.
- Use TanStack dynamic segment syntax like `$slug`.
- For single-segment ID slug routes, use route paths such as `/movie/$slug`, then parse the leading ID in the loader/server function.
- Do not interpolate params into `Link.to`; use typed `to` plus `params`.
- Use `validateSearch` and focused `loaderDeps` for `/search` query, type, and page state.

Follow the TanStack migration guide:

https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js

## Data Fetching Rules

TanStack Start code is isomorphic by default. Route loaders can run on both the server and the client. Any TMDB calls that need `TMDB_API_KEY` must live inside `createServerFn` or server-only helpers called by a `createServerFn`.

Recommended shape:

- `src/lib/tmdb/*.server.ts` for server-only TMDB fetch helpers.
- `src/lib/tmdb/*.functions.ts` for `createServerFn` wrappers that routes can import.
- Route `loader` calls the server function and returns render-ready data.
- Route `head` uses loader data for SEO title, descriptions, Open Graph, and JSON-LD where applicable.

Use TanStack Query only where it clearly helps with non-core progressive or interactive data. Core page content should be provided by route loaders/server functions for SEO.

## Environment Variables

Required for TMDB-backed pages:

```bash
TMDB_API_KEY=<tmdb api key or v4 bearer token>
```

Site URL for canonical metadata should be server-side and should not be prefixed with `VITE_` unless it is intentionally exposed to client bundles:

```bash
SITE_URL=http://localhost:3000
```

Legacy used `NEXT_PUBLIC_SITE_URL`; migrate this to `SITE_URL` for Start unless a public client value is explicitly needed.

Never use a `VITE_` prefix for `TMDB_API_KEY`.

## Cloudflare Deployment Notes

The scaffold was created with Cloudflare support:

- `vite.config.ts` includes `@cloudflare/vite-plugin`.
- `vite.config.ts` skips the Cloudflare plugin when `mode === "test"` because Vitest injects `resolve.external` options that the Cloudflare plugin rejects for Worker environments.
- `wrangler.jsonc` points `main` at `@tanstack/react-start/server-entry`.
- `wrangler.jsonc` includes `nodejs_compat`, which TanStack deployment guidance calls out as required for Worker runtime compatibility.
- Deploy script is `npm run deploy`, which runs `npm run build && wrangler deploy`.

Set Worker secrets with Wrangler, for example:

```bash
npx wrangler secret put TMDB_API_KEY
npx wrangler secret put SITE_URL
```

## Architectural Decisions

- Use TanStack Start and TanStack Router instead of Next.js App Router.
- Preserve server-first rendering for all core reference pages.
- Keep TMDB secrets server-only through `createServerFn`.
- Keep search and filters in the URL via TanStack Router search params.
- Keep components near their feature area as migration proceeds.
- Do not add auth, a database, analytics, or new third-party integrations.
- Keep generated scaffold structure unless a route migration requires a focused change.

## Known Issues

- Homepage, search, entity detail routes, sitemap, and robots migrations are complete.
- `legacy-source` is intentionally outside this app directory and should remain read-only.
- Local `rg.exe` returned access denied in this environment; use PowerShell `Get-ChildItem` and `Select-String` if needed.
- The test script uses `--passWithNoTests` until the first migration tests are added.

## Migration Differences

- Next.js `cacheLife` / `"use cache"` from the legacy TMDB helpers was not copied. The homepage now uses a TanStack route loader with a `createServerFn` boundary and route `staleTime`; future caching should be tuned for Cloudflare Workers using Start/server response patterns.
- Legacy `next/image` usage was translated to plain responsive `<img>` tags so image rendering is framework-neutral and Cloudflare-compatible.
- Legacy `NEXT_PUBLIC_SITE_URL` was replaced with server-only `SITE_URL`; no TMDB or site config secrets are exposed through `VITE_` variables.
- Starter demo routes, theme toggle localStorage behavior, and TanStack devtools UI were removed from the app shell to keep this read-only reference app minimal.
- The homepage renders a small missing-key state when `TMDB_API_KEY` is absent instead of throwing during development.
- Legacy `/search` Suspense wrapping was not copied. TanStack Start renders search through route `validateSearch`, focused `loaderDeps`, and a `createServerFn` call.
- Search type tabs and pagination are plain links instead of Next.js `Link`, preserving no-JavaScript navigation while avoiding migration of Next-specific routing APIs.
- Search metadata uses route `head` with `noindex,follow`, matching the legacy intent to avoid indexing junk search result URLs.
- Legacy Next metadata functions (`generateMetadata`, `alternates`, Open Graph/Twitter objects) were translated into TanStack route `head` meta/link/script entries. JSON-LD is emitted from `head` scripts for entity pages.
- Canonical slug mismatches use TanStack Router `redirect()` from loaders. Invalid or missing TMDB entities use `notFound()` and route-level not-found UI.
- The legacy Radix trailer modal was not copied. Entity pages use a click-through YouTube no-cookie trailer link to avoid adding client modal JavaScript during this server-first migration.
- `robots.txt` and `sitemap.xml` are implemented as TanStack Start server routes. The sitemap matches the legacy behavior and currently lists only `/`.

## Next Steps

1. Add focused tests around slug helpers, TMDB normalization, search-param parsing, and canonical redirect decisions.
2. Verify live TMDB rendering with `TMDB_API_KEY` set for `/movie/550-fight-club`, `/tv/1399-game-of-thrones`, and `/person/287-brad-pitt`.
3. Revisit Cloudflare caching headers for entity/server routes once production freshness requirements are finalized.
4. Expand `sitemap.xml` only if there is a stable source of canonical entity URLs to list.
