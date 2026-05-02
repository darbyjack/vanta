import { createFileRoute } from '@tanstack/react-router'
import { absoluteUrl } from '#/lib/seo/metadata'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${absoluteUrl('/')}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
          {
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
            },
          },
        ),
    },
  },
})
