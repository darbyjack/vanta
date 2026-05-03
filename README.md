# Vanta

A fast, read-only TMDB explorer for movies, TV shows, and people.

No accounts. No tracking. Just clean, structured data.

---

## Stack

- TanStack Start
- TanStack Router
- Cloudflare Workers
- Vite
- Tailwind CSS v4
- React 19
- pnpm
- TMDB API

---

## Features

- Server-rendered movie, TV, and person pages
- TV seasons and episode browsing
- Episode-level cast and crew
- Search with filtering
- Streaming provider data
- SEO-friendly routing and metadata
- Edge caching via Cloudflare

---

## Requirements

- Node.js (LTS recommended)
- pnpm
- TMDB API key

---

## Environment Variables

Create a `.env` file:

```env
TMDB_API_KEY=your_key_here
SITE_URL=http://localhost:3000
