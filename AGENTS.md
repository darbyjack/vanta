# Agent Guide

## Project Overview

Vanta is a read-only, SEO-oriented TMDB explorer built with TanStack Start, TanStack Router, React 19, Tailwind CSS v4, Vite, pnpm, and Cloudflare Workers.

The app renders movie, TV, season, episode, person, and search pages from TMDB data. It should stay simple, server-first, and public-reference oriented.

## Skill Loading

Before substantial TanStack Start, Router, loader, search-param, server-function, SSR, or Cloudflare deployment work:

```bash
npx @tanstack/intent@latest list
```

If one local skill clearly matches the task, load it and follow its guidance:

```bash
npx @tanstack/intent@latest load <package>#<skill>
```

Use pnpm for project scripts.

## Core Constraints

- No authentication.
- No database.
- No user-owned state.
- No analytics.
- No cookies.
- No client-side TMDB fetching.
- No internal TMDB cache unless explicitly requested.
- No KV, D1, Redis, queues, or other storage unless explicitly requested.
- Keep `TMDB_API_KEY` server-only.
- Do not expose secrets through public client-side environment variables.
- Keep pages useful without relying on client JavaScript for core content.

## Data Flow

- Route loaders prepare render-ready page data.
- TMDB-backed loaders must call `createServerFn` wrappers from `src/lib/tmdb/*.functions.ts`.
- Server functions call server-only helpers from `src/lib/tmdb/*.server.ts`.
- Low-level TMDB HTTP requests go through `src/lib/tmdb/client.server.ts`.
- Routes use loader data for page rendering and SEO metadata.
- Use TanStack Query only for clearly progressive or interactive features, not for core SEO content.

## Routing Conventions

- File routes live in `src/routes`.
- Dynamic entity routes use TanStack `$param` syntax.
- Movie, TV, and person detail routes use one slug segment, such as `/movie/$slug`.
- Parse the leading numeric TMDB ID from the slug in the loader.
- Redirect non-canonical slugs to canonical URLs.
- Use typed TanStack `<Link>` navigation with `to` plus `params`; do not interpolate params into route strings.
- Keep route-specific UI close to its feature area.

## Nested Route Outlets

TV season and episode routes are nested under the TV detail route. Parent route components must render `<Outlet />` where child content should appear.

The TV season route also needs an `<Outlet />` so episode child routes can render correctly.

Missing outlets can make nested URLs match while still rendering only the parent page.

## Search Params

- Keep search and filter state in the URL.
- Use `validateSearch` for search route inputs.
- Use focused `loaderDeps` so loader caching keys only include meaningful search state.
- Strip default values such as empty query, default type, and first page when appropriate.
- Search result pages should avoid indexing low-value query URLs.

## Caching Strategy

Use HTTP headers as the current cache layer.

- Home: short browser cache, longer shared cache.
- Search: brief cache for query result pages.
- Entity pages: longer shared cache with stale-while-revalidate.
- Robots and sitemap: static server-route cache headers.
- Built CSS and JavaScript: served directly by Cloudflare static assets.

Do not set cookies from public reference routes. Preserve asset handling so matching built assets are served directly without invoking the Worker.

## TMDB Usage Rules

- All TMDB requests must stay server-side.
- Never use a public client environment variable for `TMDB_API_KEY`.
- Normalize TMDB responses before passing data into components.
- Handle missing or invalid TMDB entities with `notFound()`.
- Keep streaming-provider data server-rendered when it is part of the core page.
- Avoid fetching large nested TV data eagerly; season and episode pages should fetch details only for the requested route.
- Episode credits expose `guest_stars` separately from `cast`; keep them separate in normalized types and route UI.
- Episode pages should prioritize episode-specific guest stars before main cast and crew.

## Performance Rules

- Prefer server-rendered core content.
- Keep client JavaScript minimal.
- Keep router preloading conservative. Do not enable global intent preloading for expensive TMDB-backed routes.
- Avoid adding new third-party client libraries unless they are clearly necessary.
- Avoid heavyweight UI patterns that require extra hydration for basic browsing.
- Preserve direct static asset serving on Cloudflare.

## Bot And Crawler Controls

`robots.txt` blocks known AI crawlers that can create expensive TMDB-backed request volume.

TMDB-backed page routes also use a server-side request guard for blocked crawler user agents before loader work. Normal browsers and traditional search engine crawlers should remain allowed unless explicitly requested otherwise.

To relax or expand crawler rules, update `src/lib/bots/policy.ts` and validate route behavior with representative user agents.

## Cloudflare Notes

- The source Wrangler config must remain compatible with clean builds.
- The Cloudflare Vite plugin emits deploy output under `dist/server` and static assets under `dist/client`.
- Deploy using the project scripts so old hashed assets are retained during rollout.
- Do not set `assets.run_worker_first: true` unless there is a specific, reviewed need.

## Future Agent Expectations

- Keep changes focused and consistent with existing route, feature, and library patterns.
- Prefer small server-only helpers over broad abstractions.
- Avoid adding auth, persistence, analytics, cookies, or new infrastructure by default.
- Keep documentation public-safe: no local machine paths, usernames, private hostnames, secrets, or migration scratch notes.
- Use structured APIs and validators instead of ad hoc parsing where practical.
- Leave unrelated worktree changes alone.

## Validation

Run these before handing off meaningful code or configuration changes:

```bash
pnpm build
pnpm test
```

For deployment or asset-handling changes, also verify that built CSS and JavaScript load from the deployed site and that static asset requests do not invoke the Worker.
