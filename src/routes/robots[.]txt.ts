import { createFileRoute } from '@tanstack/react-router'
import { cacheHeaders } from '#/lib/cache/policies'
import { absoluteUrl } from '#/lib/seo/metadata'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          [
            'User-agent: *',
            'Allow: /',
            'Allow: /movie/',
            'Allow: /tv/',
            'Allow: /person/',
            'Disallow: /search',
            'Disallow: /404',
            `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
            '',
          ].join('\n'),
          {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              ...cacheHeaders('STATIC', 'robots'),
            },
          },
        ),
    },
  },
})
