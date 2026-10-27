export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  original_title: string;
  original_language: string;
  adult: boolean;
  genres: {
    id: number;
    name: string;
  }[];
}

export interface MovieState {
  tmdb_id: string;
  favorite: boolean;
  watched: boolean;
  rating: number | null;
}

export interface MovieSearchResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}


export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}