// src/components/MovieSearch.tsx
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import type { Movie } from "@/lib/types";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.searchMovies(query.trim());
      setMovies(data.results);
    } catch {
      setError("Não foi possível pesquisar filmes.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <h1>Descubra filmes</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Digite o título de um filme"
          aria-label="Título do filme"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Pesquisar"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p>Pesquise um filme para ver os resultados.</p>
      )}

      <section className="movie-grid">
        {movies.map((movie) => (
          <Link
            href={`/movies/${movie.id}`}
            key={movie.id}
            className="movie-card"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={`Pôster de ${movie.title}`}
              />
            ) : (
              <div className="poster-placeholder">
                Sem pôster
              </div>
            )}

            <h2>{movie.title}</h2>
            <p>
              {movie.release_date?.slice(0, 4) || "Ano desconhecido"}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}