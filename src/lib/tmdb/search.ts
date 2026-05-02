import { z } from 'zod'
import { normalizeQuery } from '#/lib/url/slug'

export const searchParamsSchema = z.object({
  q: z.string().optional().default('').transform(normalizeQuery),
  type: z.enum(['all', 'movie', 'tv', 'person']).optional().default('all'),
  page: z.coerce.number().int().positive().max(500).optional().default(1),
})

export type ParsedSearchParams = z.infer<typeof searchParamsSchema>
