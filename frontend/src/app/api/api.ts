import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import React, { FormEvent } from "react";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const CHAVE_TOKEN = "access_token";

function obterToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(CHAVE_TOKEN);
}

async function apiRequisicao<T>(endpoint: string, opcoes: RequestInit = {}): Promise<T> {
  const headers = new Headers(opcoes.headers);

  const token = obterToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...opcoes,
    headers,
  });
  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const message = dados?.detail ?? `Erro HTTP ${resposta.status}`;

    throw new Error(
      typeof message === "string"
        ? message
        : "Erro ao comunicar com o servidor."
    );
  }

  return dados as T;
}

// function pesquisaFilmes(event: React.FormEvent){
//     event.preventDefault()

// }
