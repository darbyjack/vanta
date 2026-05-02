import { movieJsonLd, personJsonLd, tvJsonLd } from '#/lib/seo/jsonld'
import { entitySeo } from '#/lib/seo/metadata'
import { tmdbFetch, TmdbError } from '#/lib/tmdb/client.server'
import type {
  TmdbMovieDetail,
  TmdbPersonDetail,
  TmdbTvDetail,
} from '#/lib/tmdb/types'
import { idSlug } from '#/lib/url/slug'

async function safeDetail<T>(path: string, params: Record<string, string> = {}) {
  try {
    return await tmdbFetch<T>(path, params)
  } catch (error) {
    if (error instanceof TmdbError && error.message.includes('TMDB_API_KEY')) {
      return null
    }

    console.error(error)
    throw error
  }
}

export async function getMovieEntity(id: number) {
  const movie = await safeDetail<TmdbMovieDetail>(`/movie/${id}`, {
    append_to_response: 'credits,videos,watch/providers,similar',
  })
  if (!movie) return null

  const canonicalSlug = idSlug(movie.id, movie.title)
  const path = `/movie/${canonicalSlug}`
  const seo = entitySeo({
    title: movie.title,
    description: movie.overview,
    path,
    imagePath: movie.backdrop_path ?? movie.poster_path,
  })

  return {
    movie,
    canonicalSlug,
    seo,
    jsonLd: movieJsonLd(movie, seo.url),
  }
}

export async function getTvEntity(id: number) {
  const tv = await safeDetail<TmdbTvDetail>(`/tv/${id}`, {
    append_to_response: 'credits,videos,watch/providers,similar',
  })
  if (!tv) return null

  const canonicalSlug = idSlug(tv.id, tv.name)
  const path = `/tv/${canonicalSlug}`
  const seo = entitySeo({
    title: tv.name,
    description: tv.overview,
    path,
    imagePath: tv.backdrop_path ?? tv.poster_path,
  })

  return {
    tv,
    canonicalSlug,
    seo,
    jsonLd: tvJsonLd(tv, seo.url),
  }
}

export async function getPersonEntity(id: number) {
  const person = await safeDetail<TmdbPersonDetail>(`/person/${id}`, {
    append_to_response: 'combined_credits',
  })
  if (!person) return null

  const canonicalSlug = idSlug(person.id, person.name)
  const path = `/person/${canonicalSlug}`
  const seo = entitySeo({
    title: person.name,
    description: person.biography,
    path,
    imagePath: person.profile_path,
  })

  return {
    person,
    canonicalSlug,
    seo,
    jsonLd: personJsonLd(person, seo.url),
  }
}
