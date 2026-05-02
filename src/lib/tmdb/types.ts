export type MediaType = "movie" | "tv" | "person";

export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCredit {
  id: number;
  name: string;
  original_name?: string;
  profile_path: string | null;
  character?: string;
  job?: string;
  department?: string;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface TmdbWatchProviders {
  results?: Record<
    string,
    {
      link?: string;
      flatrate?: TmdbProvider[];
      rent?: TmdbProvider[];
      buy?: TmdbProvider[];
    }
  >;
}

export interface TmdbMovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  media_type?: "movie";
}

export interface TmdbTvSummary {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  media_type?: "tv";
}

export interface TmdbPersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  known_for?: Array<TmdbMovieSummary | TmdbTvSummary>;
  media_type?: "person";
}

export type TmdbSearchResult = TmdbMovieSummary | TmdbTvSummary | TmdbPersonSummary;

export interface TmdbMovieDetail extends TmdbMovieSummary {
  runtime: number | null;
  genres: TmdbGenre[];
  credits?: { cast: TmdbCredit[]; crew: TmdbCredit[] };
  videos?: { results: TmdbVideo[] };
  "watch/providers"?: TmdbWatchProviders;
  similar?: TmdbPage<TmdbMovieSummary>;
}

export interface TmdbTvDetail extends TmdbTvSummary {
  created_by: TmdbCredit[];
  episode_run_time: number[];
  genres: TmdbGenre[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  last_air_date: string | null;
  next_episode_to_air?: { air_date?: string | null } | null;
  credits?: { cast: TmdbCredit[]; crew: TmdbCredit[] };
  videos?: { results: TmdbVideo[] };
  "watch/providers"?: TmdbWatchProviders;
  similar?: TmdbPage<TmdbTvSummary>;
}

export interface TmdbCombinedCredit {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
  character?: string;
  job?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface TmdbPersonDetail extends TmdbPersonSummary {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  combined_credits?: {
    cast: TmdbCombinedCredit[];
    crew: TmdbCombinedCredit[];
  };
}

export interface MediaCardItem {
  id: number;
  type: MediaType;
  title: string;
  subtitle?: string;
  imagePath: string | null;
  backdropPath?: string | null;
  rating?: number;
  href: string;
}
