import { createServerFn } from '@tanstack/react-start'
import { isMediaCardItem, toMediaCard } from '#/lib/tmdb/normalize'
import {
  getNewReleases,
  getPopular,
  getTrending,
} from '#/lib/tmdb/trending.server'

export const getHomePageData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [trending, popular, newReleases] = await Promise.all([
      getTrending(),
      getPopular(),
      getNewReleases(),
    ])

    return {
      trendingItems: [
        ...trending.movies.map((item) => toMediaCard(item, 'movie')),
        ...trending.tv.map((item) => toMediaCard(item, 'tv')),
      ]
        .filter(isMediaCardItem)
        .slice(0, 8),
      popularItems: [
        ...popular.movies.map((item) => toMediaCard(item, 'movie')),
        ...popular.tv.map((item) => toMediaCard(item, 'tv')),
      ]
        .filter(isMediaCardItem)
        .slice(0, 8),
      releaseItems: [
        ...newReleases.movies.map((item) => toMediaCard(item, 'movie')),
        ...newReleases.tv.map((item) => toMediaCard(item, 'tv')),
      ]
        .filter(isMediaCardItem)
        .slice(0, 8),
    }
  },
)
