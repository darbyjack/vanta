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
})

export type ParsedSearchParams = z.infer<typeof searchParamsSchema>
