import { createServerFn } from '@tanstack/react-start'
import {
  getMovieEntity,
  getPersonEntity,
  getTvEntity,
} from '#/lib/tmdb/entity.server'

const idValidator = (data: { id: number }) => data

export const getMoviePageData = createServerFn({ method: 'GET' })
  .inputValidator(idValidator)
  .handler(({ data }) => getMovieEntity(data.id))

export const getTvPageData = createServerFn({ method: 'GET' })
  .inputValidator(idValidator)
  .handler(({ data }) => getTvEntity(data.id))

export const getPersonPageData = createServerFn({ method: 'GET' })
  .inputValidator(idValidator)
  .handler(({ data }) => getPersonEntity(data.id))
