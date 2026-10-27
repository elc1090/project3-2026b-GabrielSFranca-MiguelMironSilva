// src/lib/api.ts

import type {
  Movie,
  MovieDetails,
  MovieSearchResponse,
  MovieState,
  User,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000/api";

const TOKEN_KEY = "access_token";

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ?? `Erro HTTP ${response.status}`;

    throw new Error(
      typeof message === "string"
        ? message
        : "Erro ao comunicar com o servidor."
    );
  }

  return data as T;
}

export const api = {
  searchMovies(query: string) {
    return request<MovieSearchResponse>(
      `/movies/search?query=${encodeURIComponent(query)}`
    );
  },

  getMovie(id: number | string) {
    return request<MovieDetails>(`/movies/${id}`);
  },

  getMovieCredits(id: number | string) {
    return request<{ cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[] }>(`/movies/${id}/credits`);
  },

  getMyMovies() {
    return request<MovieState[]>("/my-movies/");
  },

  getMovieState(id: number | string) {
    return request<MovieState>(`/my-movies/${id}`);
  },

  updateMovieState(
    id: number | string,
    changes: Partial<Pick<MovieState,
      "favorite" | "watched" | "rating"
    >>
  ) {
    return request<MovieState>(`/my-movies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
  },

  getCurrentUser() {
    return request<User>("/auth/me");
  },
};