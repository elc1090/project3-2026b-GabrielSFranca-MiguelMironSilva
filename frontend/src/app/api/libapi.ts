// frontend/src/app/api/api.ts
const PORT=8000;
export const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://127.0.0.1:${PORT}/api`;
export const IMAGEM_URL="https://image.tmdb.org/t/p/";

// importacao como tipo
import type {
    MovieSearchResponse,
    MovieDetailsType,
    MovieSavedState,
} from "../types/movie";

import type { Movie } from "./api";

import type{
  User
} from "../types/user";

const TOKEN_KEY="access_token";

function obterToken(){
    if(typeof window==='undefined'){ return null }
    return sessionStorage.getItem(TOKEN_KEY);
}

function salvarToken(token: string){
    sessionStorage.setItem(TOKEN_KEY, token);
}

function removerToken(){
    sessionStorage.removeItem(TOKEN_KEY);
}

export function anoLancFilme(filme: Movie): string{
    const ano=filme.release_date ? filme.release_date.split('-')[0] : "Sem ano";
    return(ano);
}

const estaAutenticado =()=> Boolean(obterToken())
// function estaAutenticado() => Boolean(obterToken())

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if(options.body instanceof URLSearchParams){
    headers.set(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=UTF-8",
    )
  }else if(options.body && !(options.body instanceof FormData)){
    headers.set("Content-Type", "application/json")
  }

  const token = obterToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const resposta = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const message =
      dados?.detail ?? `Erro HTTP ${resposta.status}`;

    throw new Error(
      typeof message === "string"
        ? message
        : "Erro ao comunicar com o servidor."
    );
  }

  return dados as T;
}

export const api={

    pesquisaFilmes(query:string){
        return request<MovieSearchResponse>(`/movies/search?query=${encodeURIComponent(query)}`)
    },

    obterFilme(id: string | number){
        return request<MovieDetailsType>(`/movies/${id}`)
    },
    
    obterCreditosFilme(id: string) {
        return request<{ cast?: { id: number; name: string; character: string }[] }>(`/movies/${encodeURIComponent(id)}/credits`,);
    },

    obterColecaoDeFilmes(){
        return request<MovieSavedState[]>("/my-movies/")
    },

    obterEstadoFilme(id: string | number){
        return request<MovieSavedState>(`/my-movies/${encodeURIComponent(id)}`)
    }
    // obterUsuarioAtual(){
    //     return request>
    // }
//   updateMovieState(
//     id: number | string,
//     changes: Partial<Pick<MovieState,
//       "favorite" | "watched" | "rating"
//     >>
//   ) {
//     return request<MovieState>(`/my-movies/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(changes),
//     });
//   },

}




export async function cadastrarUsuario(username:string, email:string, password:string){
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({username, email, password})
  })
}