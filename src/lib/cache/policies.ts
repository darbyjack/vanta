import { setResponseHeaders } from '@tanstack/react-start/server'

export type CachePolicyName = 'HOME' | 'SEARCH' | 'ENTITY' | 'STATIC'

interface CachePolicy {
  cacheControl: string
  cdnCacheControl: string
}

export const CACHE_POLICIES = {
  HOME: {
    cacheControl:
      'public, max-age=300, s-maxage=3600, stale-while-revalidate=7200',
    cdnCacheControl:
      'public, max-age=3600, stale-while-revalidate=7200',
  },
  SEARCH: {
    cacheControl:
      'public, max-age=60, s-maxage=600, stale-while-revalidate=1800',
    cdnCacheControl:
      'public, max-age=600, stale-while-revalidate=1800',
  },
  ENTITY: {
    cacheControl:
      'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
    cdnCacheControl:
      'public, max-age=86400, stale-while-revalidate=604800',
  },
  STATIC: {
    cacheControl: 'public, max-age=3600, s-maxage=86400',
    cdnCacheControl: 'public, max-age=86400',
  },
} satisfies Record<CachePolicyName, CachePolicy>

function isProduction() {
  return process.env.NODE_ENV === 'production'
}

export function cacheHeaders(
  policyName: CachePolicyName,
  routeKind: string,
) {
  const policy = CACHE_POLICIES[policyName]
  return {
    'Cache-Control': policy.cacheControl,
    'CDN-Cache-Control': policy.cdnCacheControl,
    ...(!isProduction()
      ? {
          'x-vanta-cache-policy': policyName,
          'x-vanta-route-kind': routeKind,
        }
      : {}),
  }
}

export function applyCachePolicy(
  policyName: CachePolicyName,
  routeKind: string,
) {
  setResponseHeaders(cacheHeaders(policyName, routeKind))
}
