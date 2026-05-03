import { createFileRoute } from '@tanstack/react-router'
import { ROBOTS_BLOCKED_USER_AGENTS } from '#/lib/bots/policy'
import { absoluteUrl } from '#/lib/seo/metadata'

const robotsHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'public, max-age=300, s-maxage=3600',
  'CDN-Cache-Control': 'public, max-age=3600',
}

function robotsText() {
  return [
    ...ROBOTS_BLOCKED_USER_AGENTS.flatMap((userAgent) => [
      `User-agent: ${userAgent}`,
      'Disallow: /',
      '',
    ]),
    'User-agent: *',
    'Allow: /',
    'Allow: /movie/',
    'Allow: /tv/',
    'Allow: /person/',
    'Disallow: /search',
    'Disallow: /404',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ].join('\n')
}

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () =>
        new Response(robotsText(), {
          headers: robotsHeaders,
        }),
      HEAD: async () =>
        new Response(null, {
          headers: robotsHeaders,
        }),
    },
  },
})
