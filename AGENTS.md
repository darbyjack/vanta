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
- `pnpm run build` currently emits Cloudflare deploy output to `dist/server/index.js` and static client assets to `dist/client`.
- `wrangler.jsonc` uses `main: "@tanstack/react-start/server-entry"` so clean builds work before `dist/server/index.js` exists. The Cloudflare Vite plugin emits `dist/server/wrangler.json`, and Wrangler deploy uses that redirected config with `main: "index.js"` relative to `dist/server` and `assets.directory: "../client"`.
- `wrangler.jsonc` configures `assets.directory` as `dist/client` with the `ASSETS` binding. Do not deploy without an assets directory because static asset requests can be counted as Worker requests.
- `wrangler.jsonc` includes `nodejs_compat`, which TanStack deployment guidance calls out as required for Worker runtime compatibility.
- Do not set `assets.run_worker_first: true`; leave the default asset behavior so matching files in `dist/client` are served directly instead of invoking the Worker.
- Worker observability is enabled in `wrangler.jsonc`.
- Deploy scripts use pnpm. `pnpm run deploy` and `pnpm run cf:deploy` run `pnpm run build && wrangler deploy --old-asset-ttl 604800` so cached HTML can still load the previous hashed CSS/JS assets during deploy rollover.

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
- Use centralized cache policies from `src/lib/cache/policies.ts` and TanStack Start response header helpers for route-loader/server-function responses.
- Use HTTP/CDN response headers as the current Cloudflare cache layer.
- Do not add an internal TMDB cache, Cloudflare Cache API calls, KV, Redis, D1, Neon, Drizzle, Sentry, auth, analytics, or user-owned data.

## Known Issues

- Homepage, search, entity detail routes, TV season and episode routes, sitemap, and robots migrations are complete.
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
- `robots.txt` blocks common AI crawlers, including Anthropic, OpenAI, Perplexity, Google-Extended, CCBot, Bytespider, and Applebot-Extended agents. Normal search engines such as Googlebot and Bingbot remain allowed.
- TMDB fetches check the request `User-Agent` in `src/lib/tmdb/client.server.ts` and return a 403 before TMDB work for blocked AI crawler patterns. To relax bot rules later, edit `src/lib/bots/policy.ts`.
- TV detail pages render season cards from the `/tv/{id}` response only. They do not fetch every episode or any episode credits.
- TV season pages fetch season details and season-level credits only. Episode rows link to episode routes and omit per-episode cast.
- TV episode pages fetch episode details and episode credits lazily for that episode route only.
- Season and episode routes are nested under `tv.$slug.tsx` in TanStack's generated route tree. The TV detail route must render an `<Outlet>` for child URLs, otherwise `/tv/$slug/season/$seasonNumber` matches but the parent TV detail component swallows the child page.
- The season route also renders an `<Outlet>` for episode URLs so `/tv/$slug/season/$seasonNumber/episode/$episodeNumber` can render the episode page instead of the season page.
- Season and episode navigation uses typed TanStack `<Link>` with `to` plus `params`, not interpolated route strings.
- Global router preloading is disabled with `defaultPreload: false` to reduce accidental route-loader and Worker request volume. Re-enable preloading later only for routes known to be safe and cheap.
- Entity routes also set `preload: false` to avoid intent-hover TMDB detail calls.
- Search uses direct Zod v4 validation and strips default `type=all` and `page=1` search params through TanStack Router search middleware.

## Cache Policy Table

| Policy | Routes | Cache-Control |
| --- | --- | --- |
| HOME | `/` | `public, max-age=300, s-maxage=3600, stale-while-revalidate=7200` |
| SEARCH | `/search` | `public, max-age=60, s-maxage=600, stale-while-revalidate=1800` |
| ENTITY | movie, TV, person, season, episode | `public, max-age=300, s-maxage=86400, stale-while-revalidate=604800` |
| STATIC | sitemap | `public, max-age=3600, s-maxage=86400` |
| ROBOTS | robots | `public, max-age=300, s-maxage=3600` |

`CDN-Cache-Control` is emitted alongside `Cache-Control` for Cloudflare. Non-production responses include `x-vanta-cache-policy` and `x-vanta-route-kind`; production responses omit those debug headers. Do not set cookies from public reference routes.

## Feature Pass Validation

- `pnpm run build` passes.
- `pnpm run test` passes, with no test files currently present because the script uses `--passWithNoTests`.
- Live TMDB validation passed locally with `TMDB_API_KEY` for `/`, `/search`, `/search?q=batman`, `/movie/550-fight-club`, `/tv/1399-game-of-thrones`, `/tv/1399-game-of-thrones/season/1`, `/tv/1399-game-of-thrones/season/1/episode/1`, `/person/287-brad-pitt`, `/robots.txt`, and `/sitemap.xml`.
- Season navigation bug validation passed locally: clicking Season 1 from `/tv/1399-game-of-thrones` changes the URL to `/tv/1399-game-of-thrones/season/1` and renders the Season 1 page with an episode list; clicking episode 1 renders `Winter Is Coming` with episode credits.
- Root cause: nested TanStack route files were correct, but parent route components did not render child outlets. A non-nested underscore route attempt can make SSR appear correct while causing hydrated client mismatch in this app, so the stable fix is nested route files plus explicit child outlets.
- Header validation after deploy should check `Cache-Control`, `CDN-Cache-Control`, no `Set-Cookie`, and Cloudflare `CF-Cache-Status`.
- Worker request-volume root cause: the source Wrangler config pointed directly at `@tanstack/react-start/server-entry` and did not declare static assets, while the build output expected a built Worker at `dist/server/index.js` plus direct asset serving from `dist/client`. This could route asset traffic through the Worker and inflate request counts.
- Request-volume mitigation validation should include `pnpm run build`, `pnpm wrangler deploy`, `curl -I https://vanta.glare.workers.dev/`, `curl -I https://vanta.glare.workers.dev/favicon.ico`, and `pnpm wrangler tail` while loading the site once to confirm static asset requests are not logged as Worker invocations.
- Request-volume mitigation validation on 2026-05-03: `pnpm run build` passed, `pnpm wrangler deploy` uploaded `dist/client` assets and deployed Worker version `b81d0b8d-11a0-4e8f-865f-c71e6da817c2`, app route headers had `Cache-Control` and `CDN-Cache-Control` with no `Set-Cookie`, static asset headers returned `CF-Cache-Status`, and filtered `wrangler tail` output showed only app-route requests for `vanta.glare.workers.dev` with no `/assets/...` or `/favicon.ico` Worker events.
- CSS outage root cause: deployed HTML referenced an older hashed stylesheet while Workers Assets only had the newer hashed CSS. Keep old assets during deployment with `--old-asset-ttl 604800`, and verify deployed HTML, CSS, and JS filenames together after each deploy.
- Bot control validation should include `curl https://vanta.glare.dev/robots.txt`, `curl -I -A "ClaudeBot" https://vanta.glare.dev/`, `curl -I -A "Mozilla/5.0" https://vanta.glare.dev/`, and `pnpm wrangler tail --format json` to inspect live request user agents and `asOrganization`.
- CSS/bot validation on 2026-05-03: `pnpm run build`, `pnpm run test`, and `pnpm wrangler deploy --old-asset-ttl 604800` passed; deployed Worker version `20fed608-a752-4dfa-a383-88a00b8f4967`; deployed HTML references `/assets/styles-BI9_2CSx.css` and `/assets/index-Cfl1jyv3.js`; those CSS/JS assets return `200` from Cloudflare static assets; `curl -I -A "ClaudeBot" https://vanta.glare.dev/` returns `403`; `curl -I -A "Mozilla/5.0" https://vanta.glare.dev/` returns `200`; `curl -I https://vanta.glare.dev/robots.txt` returns `text/plain` with `Cache-Control: public, max-age=300, s-maxage=3600`; filtered `wrangler tail` saw the app route for `vanta.glare.workers.dev` and no `/assets/...` or `/favicon.ico` Worker events.

## Next Steps

1. Add focused tests around slug helpers, TMDB normalization, search-param parsing, canonical redirects, and season/episode param validation.
2. Verify live TMDB rendering with `TMDB_API_KEY` set for `/movie/550-fight-club`, `/tv/1399-game-of-thrones`, `/tv/1399-game-of-thrones/season/1`, `/tv/1399-game-of-thrones/season/1/episode/1`, and `/person/287-brad-pitt`.
3. Revisit Cloudflare caching freshness after production traffic patterns are known.
4. Expand `sitemap.xml` only if there is a stable source of canonical entity URLs to list.
