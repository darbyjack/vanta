import { z } from 'zod'
import { normalizeQuery } from '#/lib/url/slug'

export const searchParamsSchema = z.object({
  q: z.string().optional().default('').catch('').transform(normalizeQuery),
  type: z
    .enum(['all', 'movie', 'tv', 'person'])
    .optional()
    .default('all')
    .catch('all'),
  page: z.coerce
    .number()
    .int()
    .positive()
    .max(500)
    .optional()
    .default(1)
    .catch(1),
  year: z.coerce.number().int().min(1874).max(2100).optional().catch(undefined),
  sort: z
    .enum(['popularity', 'rating', 'release_date'])
    .optional()
    .default('popularity')
    .catch('popularity'),
  genre: z
    .string()
    .regex(/^\d+(?:[|,]\d+)*$/)
    .optional()
    .catch(undefined),
})

export type ParsedSearchParams = z.infer<typeof searchParamsSchema>

export function hasSearchFilters(params: ParsedSearchParams) {
  return Boolean(
    params.year ||
      params.genre ||
      (params.sort && params.sort !== 'popularity'),
  )
}
