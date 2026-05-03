import { createServerFn } from '@tanstack/react-start'
import { applyCachePolicy } from '#/lib/cache/policies'
import {
  getMovieEntity,
  getPersonEntity,
  getTvEpisodeEntity,
  getTvEntity,
  getTvSeasonEntity,
} from '#/lib/tmdb/entity.server'

const idValidator = (data: { id: number }) => data
const seasonValidator = (data: { id: number; seasonNumber: number }) => data
const episodeValidator = (data: {
  id: number
  seasonNumber: number
  episodeNumber: number
}) => data

export const getMoviePageData = createServerFn({ method: 'GET' })
  .inputValidator(idValidator)
  .handler(async ({ data }) => {
    const result = await getMovieEntity(data.id)
    if (result) applyCachePolicy('ENTITY', 'movie')
    return result
  })

export const getTvPageData = createServerFn({ method: 'GET' })
  .inputValidator(idValidator)
  .handler(async ({ data }) => {
    const result = await getTvEntity(data.id)
    if (result) applyCachePolicy('ENTITY', 'tv')
    return result
  })

export const getPersonPageData = createServerFn({ method: 'GET' })
  .inputValidator(idValidator)
  .handler(async ({ data }) => {
    const result = await getPersonEntity(data.id)
    if (result) applyCachePolicy('ENTITY', 'person')
    return result
  })

export const getTvSeasonPageData = createServerFn({ method: 'GET' })
  .inputValidator(seasonValidator)
  .handler(async ({ data }) => {
    const result = await getTvSeasonEntity(data.id, data.seasonNumber)
    if (result) applyCachePolicy('ENTITY', 'tv-season')
    return result
  })

export const getTvEpisodePageData = createServerFn({ method: 'GET' })
  .inputValidator(episodeValidator)
  .handler(async ({ data }) => {
    const result = await getTvEpisodeEntity(
      data.id,
      data.seasonNumber,
      data.episodeNumber,
    )
    if (result) applyCachePolicy('ENTITY', 'tv-episode')
    return result
  })
