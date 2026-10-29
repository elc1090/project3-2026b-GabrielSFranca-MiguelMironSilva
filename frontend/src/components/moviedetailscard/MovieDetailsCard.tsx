"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  atualizarEstadoFilme,
  obterCreditosFilme,
  obterEstadoFilme,
  obterFilme,
  estaAutenticado,
  type MovieState,
  type Movie,
} from "@/app/api/api";
import styles from "./MovieDetailsCard.module.css";

import {MembroElenco} from "@/app/types/movie";

type MovieLibraryStatus = {
  movieId: string;
  state?: MovieState;
  error?: string;
};

// type MembroElenco = {
//   id: number;
//   name: string;
//   character: string;
//   profile_path: string | null;
// };

export function MovieDetailsCard({
  params,
}: PageProps<"/movies/[id]">) {
  const [movieId, setMovieId] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<MembroElenco[]>([]);
  const [error, setError] = useState("");
  const [libraryStatus, setLibraryStatus] =
    useState<MovieLibraryStatus | null>(null);
  const [savingState, setSavingState] = useState(false);
  const [reviewDraft, setReviewDraft] = useState("");
  const [ratingDraft, setRatingDraft] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const isAuthenticated = estaAutenticado();
  const currentLibraryStatus =
    libraryStatus?.movieId === movieId ? libraryStatus : null;
  const movieState = currentLibraryStatus?.state ?? null;

  useEffect(() => {
    let cancelado = false;

    params.then(({ id }) => {
      if (!cancelado) setMovieId(id);
    });

    return () => {
      cancelado = true;
    };
  }, [params]);

  useEffect(() => {
    if (!movieId) return;

    let cancelled = false;

    Promise.all([obterFilme(movieId), obterCreditosFilme(movieId)])
      .then(([details, credits]) => {
        if (cancelled) return;
        setMovie(details);
        setCast(credits.cast?.slice(0, 10) ?? []);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Não foi possível carregar os detalhes do filme.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;

    let cancelled = false;

    if (isAuthenticated) {
      obterEstadoFilme(movieId)
        .then((state) => {
          if (!cancelled) {
            setLibraryStatus({ movieId, state });
            setReviewDraft(state.review_text ?? "");
            setRatingDraft(
              state.rating == null ? "" : String(state.rating),
            );
          }
        })
        .catch((cause: unknown) => {
          if (!cancelled) {
            setLibraryStatus({
              movieId,
              error:
                cause instanceof Error
                  ? cause.message
                  : "Não foi possível carregar o estado do filme.",
            });
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, movieId]);

  async function updateMovieState(
    changes: Partial<Pick<MovieState, "favorite" | "watched">>,
  ) {
    if (!movieId || !movieState) return;

    setSavingState(true);
    try {
      const state = await atualizarEstadoFilme(movieId, changes);
      setLibraryStatus({ movieId, state });
    } catch (cause: unknown) {
      setLibraryStatus({
        movieId,
        state: movieState,
        error:
          cause instanceof Error
            ? cause.message
            : "Não foi possível salvar o estado do filme.",
      });
    } finally {
      setSavingState(false);
    }
  }

  async function saveReview() {
  if (!movieId || !movieState) return;

  setSavingReview(true);
  setReviewMessage("");

  try {
    const state = await atualizarEstadoFilme(movieId, {
      review_text: reviewDraft.trim() || null,
      rating: ratingDraft === "" ? null : Number(ratingDraft),
    });

    setLibraryStatus({ movieId, state });
    setReviewDraft(state.review_text ?? "");
    setRatingDraft(
      state.rating == null ? "" : String(state.rating),
    );
    setReviewMessage("Avaliação salva com sucesso!");
  } catch (cause: unknown) {
    setReviewMessage(
      cause instanceof Error
        ? cause.message
        : "Não foi possível salvar sua avaliação.",
    );
  } finally {
    setSavingReview(false);
  }
}

  return (
    <section className={styles.page}>
        {/* <Link href="/" className={styles.brand}>
          FilmsBR
        </Link> */}
        <Link href="/" className={styles.backLink}>
          ← Voltar à busca
        </Link>

      {error && (
        <p className={styles.message} role="alert">
          {error}
        </p>
      )}
      {!movie && !error && (
        <p className={styles.message} role="status">
          Carregando detalhes do filme...
        </p>
      )}

      {movie && (
        <article className={styles.content}>
          <section className={styles.movie}>
            {movie.poster_path ? (
              <img
                className={styles.poster}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Pôster de ${movie.title}`}
              />
            ) : (
              <div className={styles.posterPlaceholder}>Pôster indisponível</div>
            )}

            <div className={styles.movieInfo}>
              <p className={styles.eyebrow}>DETALHES DO FILME</p>
              <h1 className={styles.title}>{movie.title}</h1>
              <p className={styles.metadata}>
                {movie.release_date?.slice(0, 4) || "Ano não informado"}
                {movie.runtime ? ` · ${movie.runtime} min` : ""}
                {movie.vote_average != null
                  ? ` · ★ ${movie.vote_average.toFixed(1)}/10`
                  : ""}
              </p>

              {movie.genres && movie.genres.length > 0 && (
                <p className={styles.genres}>
                  {movie.genres.map((genre) => genre.name).join(" · ")}
                </p>
              )}

              <section className={styles.overview}>
                <h2>Sinopse</h2>
                <p>{movie.overview || "Sinopse indisponível."}</p>
              </section>

              {isAuthenticated ? (
                <div className={styles.movieActions}>
                  {movieState ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.stateButton} ${
                          movieState.favorite ? styles.stateButtonActive : ""
                        }`}
                        aria-pressed={movieState.favorite}
                        disabled={savingState}
                        onClick={() =>
                          void updateMovieState({
                            favorite: !movieState.favorite,
                          })
                        }
                      >
                        {movieState.favorite ? "♥ Favorito" : "♡ Favoritar"}
                      </button>
                      <button
                        type="button"
                        className={`${styles.stateButton} ${
                          movieState.watched ? styles.stateButtonActive : ""
                        }`}
                        aria-pressed={movieState.watched}
                        disabled={savingState}
                        onClick={() =>
                          void updateMovieState({
                            watched: !movieState.watched,
                          })
                        }
                      >
                        {movieState.watched
                          ? "✓ Assistido"
                          : "Marcar como assistido"}
                      </button>
                    </>
                  ) : currentLibraryStatus?.error ? null : (
                    <p className={styles.message} role="status">
                      Carregando sua biblioteca...
                    </p>
                  )}
                  {currentLibraryStatus?.error && (
                    <p className={styles.message} role="alert">
                      {currentLibraryStatus.error}
                    </p>
                  )}
                  {movieState && (
                    <form
                      className={styles.reviewForm}
                      onSubmit={(event) => {
                        event.preventDefault();
                        void saveReview();
                      }}
                    >
                      <h2>Minha avaliação</h2>

                      <label htmlFor="personal-rating">Minha nota</label>
                      <select
                        id="personal-rating"
                        value={ratingDraft}
                        onChange={(event) => setRatingDraft(event.target.value)}
                        disabled={savingReview}
                      >
                        <option value="">Sem nota</option>
                        {Array.from({ length: 11 }, (_, n) => (
                          <option key={n} value={n}>
                            {n}/10
                          </option>
                        ))}
                      </select>

                      <label htmlFor="review-text">Minha resenha</label>
                      <textarea
                        id="review-text"
                        value={reviewDraft}
                        onChange={(event) => setReviewDraft(event.target.value)}
                        placeholder="O que você achou deste filme?"
                        maxLength={5000}
                        rows={6}
                        disabled={savingReview}
                      />

                      <p className={styles.reviewCounter}>
                        {reviewDraft.length}/5000 caracteres
                      </p>

                      <button
                        type="submit"
                        className={styles.stateButton}
                        disabled={savingReview}
                      >
                        {savingReview ? "Salvando..." : "Salvar avaliação"}
                      </button>

                      {reviewMessage && (
                        <p className={styles.message} role="status" aria-live="polite">
                          {reviewMessage}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              ) : (
                <p className={styles.message}>
                  Entre na sua conta para favoritar ou marcar este filme como
                  assistido.
                </p>
              )}
            </div>
          </section>

          <section className={styles.castSection}>
            <h2>Elenco principal</h2>
            {cast.length > 0 ? (
              <ul className={styles.castGrid}>
                {cast.map((ator) => (
                  <li className={styles.castCard} key={ator.id}>
                    {ator.profile_path ? (
                      <img
                        className={styles.actorPhoto}
                        src={`https://image.tmdb.org/t/p/w185${ator.profile_path}`}
                        alt={`Foto de ${ator.name}`}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className={styles.actorPlaceholder}
                        role="img"
                        aria-label={`Foto indisponível para ${ator.name}`}
                      >
                        {ator.name.charAt(0)}
                      </div>
                    )}
                    <span className={styles.actorName}>{ator.name}</span>
                    {ator.character && (
                      <span className={styles.character}>
                        {ator.character}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.message}>Elenco indisponível.</p>
            )}
          </section>
        </article>
      )}
    </section>
  );
}
