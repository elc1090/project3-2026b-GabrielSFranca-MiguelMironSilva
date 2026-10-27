import type { CatalogMovie, Movie } from "@/types/movie";
import type {
  ApiErrorDto,
  ApiSuccessDto,
  CreateUserDto,
  MovieSearchResponseDto,
  SaveMovieDto,
  UpdateMovieDto,
} from "@/types/dto";
import type { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: options.method ?? "GET",
    cache: "no-store",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessDto<T>
    | ApiErrorDto
    | null;

  if (!response.ok) {
    const message = payload && "error" in payload
      ? payload.error.message
      : "Não foi possível concluir a requisição.";
    throw new Error(message);
  }

  if (!payload || !("data" in payload)) {
    throw new Error("A resposta da API tem um formato inesperado.");
  }

  return payload.data;
}

export const api = {
  listUsers(): Promise<User[]> {
    return request<User[]>("/api/users");
  },

  createUser(input: CreateUserDto): Promise<User> {
    return request<User>("/api/users", { method: "POST", body: input });
  },

  getUser(userId: string): Promise<User> {
    return request<User>(`/api/users/${encodeURIComponent(userId)}`);
  },

  searchMovies(query = ""): Promise<MovieSearchResponseDto> {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    const queryString = params.toString();
    const suffix = queryString ? `?${queryString}` : "";
    return request<MovieSearchResponseDto>(`/api/movies${suffix}`);
  },

  getMovieDetails(tmdbId: number): Promise<CatalogMovie> {
    return request<CatalogMovie>(`/api/movies/${tmdbId}`);
  },

  getUserMovies(userId: string): Promise<Movie[]> {
    return request<Movie[]>(`/api/users/${encodeURIComponent(userId)}/movies`);
  },

  saveMovie(userId: string, input: SaveMovieDto): Promise<Movie> {
    return request<Movie>(`/api/users/${encodeURIComponent(userId)}/movies`, {
      method: "POST",
      body: input,
    });
  },

  updateMovie(userId: string, movieId: string, input: UpdateMovieDto): Promise<Movie> {
    return request<Movie>(
      `/api/users/${encodeURIComponent(userId)}/movies/${encodeURIComponent(movieId)}`,
      { method: "PATCH", body: input },
    );
  },

  removeMovie(userId: string, movieId: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(
      `/api/users/${encodeURIComponent(userId)}/movies/${encodeURIComponent(movieId)}`,
      { method: "DELETE" },
    );
  },
};
