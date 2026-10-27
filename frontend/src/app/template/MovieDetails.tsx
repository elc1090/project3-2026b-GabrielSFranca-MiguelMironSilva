"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { MovieDetails as MovieDetailsType } from "@/lib/types";

export default function MovieDetails({
  tmdbId,
}: {
  tmdbId: string;
}) {
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [cast, setCast] = useState<
    { id: number; name: string; character: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMovie() {
      setLoading(true);
      setError("");

      try {
        const [details, credits] = await Promise.all([
          api.getMovie(tmdbId),
          api.getMovieCredits(tmdbId),
        ]);

        if (cancelled) return;

        setMovie(details);
        setCast(credits.cast.slice(0, 10));
      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar o filme.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovie();

    return () => {
      cancelled = true;
    };
  }, [tmdbId]);

  if (loading) return <main className="page">Carregando...</main>;
  if (error || !movie) {
    return <main className="page">{error || "Filme não encontrado."}</main>;
  }

  return (
    <main className="page movie-detail">
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`Pôster de ${movie.title}`}
        />
      )}

      <div>
        <h1>{movie.title}</h1>

        <p>
          {movie.release_date?.slice(0, 4)} ·
          Nota TMDB: {movie.vote_average.toFixed(1)}/10
        </p>

        <p>{movie.overview || "Sinopse indisponível."}</p>

        <h2>Gêneros</h2>
        <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>

        <h2>Elenco</h2>
        <ul>
          {cast.map((person) => (
            <li key={person.id}>
              {person.name} — {person.character}
            </li>
          ))}
        </ul>

        {/* Inserir aqui o componente MovieControls */}
      </div>
    </main>
  );
}