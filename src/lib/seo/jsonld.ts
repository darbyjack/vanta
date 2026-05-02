import { tmdbImage } from '#/lib/tmdb/images'
import type {
  TmdbMovieDetail,
  TmdbPersonDetail,
  TmdbTvDetail,
} from '#/lib/tmdb/types'

export function movieJsonLd(movie: TmdbMovieDetail, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    url,
    image: tmdbImage(movie.poster_path, 'w500'),
    description: movie.overview,
    datePublished: movie.release_date,
    genre: movie.genres.map((genre) => genre.name),
    actor: movie.credits?.cast
      .slice(0, 8)
      .map((actor) => ({ '@type': 'Person', name: actor.name })),
    director: movie.credits?.crew
      .filter((crew) => crew.job === 'Director')
      .map((director) => ({ '@type': 'Person', name: director.name })),
    aggregateRating: movie.vote_count
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.vote_average,
          ratingCount: movie.vote_count,
          bestRating: 10,
        }
      : undefined,
  }
}

export function tvJsonLd(tv: TmdbTvDetail, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tv.name,
    url,
    image: tmdbImage(tv.poster_path, 'w500'),
    description: tv.overview,
    datePublished: tv.first_air_date,
    genre: tv.genres.map((genre) => genre.name),
    actor: tv.credits?.cast
      .slice(0, 8)
      .map((actor) => ({ '@type': 'Person', name: actor.name })),
    aggregateRating: tv.vote_count
      ? {
          '@type': 'AggregateRating',
          ratingValue: tv.vote_average,
          ratingCount: tv.vote_count,
          bestRating: 10,
        }
      : undefined,
  }
}

export function personJsonLd(person: TmdbPersonDetail, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url,
    image: tmdbImage(person.profile_path, 'w500'),
    description: person.biography,
    birthDate: person.birthday,
    deathDate: person.deathday,
    birthPlace: person.place_of_birth,
  }
}
