export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export type Movie = {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  runtime?: number | null;
  genres?: { id: number; name: string }[];
};

export type User = { id: string; username: string; email: string };
export type MovieState = {
  tmdb_id: string;
  favorite: boolean;
  watched: boolean;
  rating: number | null;
};
const TOKEN_KEY = "access_token";

function obterToken() {
  return typeof window === "undefined"
    ? null
    : sessionStorage.getItem(TOKEN_KEY);
}

export function salvarToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function limparToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}
export function estaAutenticado() {
  return Boolean(obterToken());
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body instanceof URLSearchParams)
    headers.set(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=UTF-8",
    );
  else if (options.body && !(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const token = obterToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Confira se o backend está em execução.",
    );
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    throw new Error(
      typeof detail === "string"
        ? detail
        : `Erro ao comunicar com a API (${response.status}).`,
    );
  }
  return data as T;
}

export async function pesquisaFilmes(query: string) {
  return request<{ results: Movie[] }>(
    `/movies/search?query=${encodeURIComponent(query)}`,
  );
}
export function obterFilme(id: string) {
  return request<Movie>(`/movies/${encodeURIComponent(id)}`);
}
export function obterCreditosFilme(id: string) {
  return request<{
    cast?: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  }>(`/movies/${encodeURIComponent(id)}/credits`);
}
export function register(username: string, email: string, password: string) {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
export async function login(identifier: string, password: string) {
  const body = new URLSearchParams({ username: identifier, password });
  const result = await request<{ access_token: string; token_type: string }>(
    "/auth/login",
    { method: "POST", body },
  );
  salvarToken(result.access_token);
  return result;
}
export function obterUsuarioAtual() {
  return request<User>("/auth/me");
}
export function obterColecaoFilmes() {
  return request<MovieState[]>("/my-movies/");
}
export function obterEstadoFilme(id: string) {
  return request<MovieState>(`/my-movies/${encodeURIComponent(id)}`);
}
export function atualizarEstadoFilme(
  id: string,
  changes: Partial<Pick<MovieState, "favorite" | "watched" | "rating">>,
) {
  return request<MovieState>(`/my-movies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}
