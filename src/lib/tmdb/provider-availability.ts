import type { TmdbProvider, TmdbWatchProviders } from '#/lib/tmdb/types'

type ProviderRegion = NonNullable<TmdbWatchProviders['results']>[string]

export interface ProviderAvailabilityGroup {
  key: 'flatrate' | 'rent' | 'buy'
  label: string
  providers: TmdbProvider[]
}

const providerGroups = [
  ['flatrate', 'Stream'],
  ['rent', 'Rent'],
  ['buy', 'Buy'],
] as const

export function providerAvailabilityGroups(
  providers?: ProviderRegion,
): ProviderAvailabilityGroup[] {
  if (!providers) return []

  return providerGroups.flatMap(([key, label]) => {
    const list = providers[key]?.slice(0, 8) ?? []
    return list.length ? [{ key, label, providers: list }] : []
  })
}

export function hasProviderAvailability(providers?: ProviderRegion) {
  return providerAvailabilityGroups(providers).length > 0
}
