"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  estaAutenticado,
  obterColecaoFilmes,
  obterFilme,
  obterUsuarioAtual,
  type Movie,
  type MovieState,
  type User,
} from "@/app/api/api";
import styles from "./page.module.css";

type ProfileData = {
  profileId: string;
  user: User;
  favorites: Movie[];
  watched: Movie[];
  libraryError?: string;
  detailWarning?: string;
};

type ProfileStatus =
  | {
      profileId: string;
      kind: "error" | "unauthenticated" | "forbidden";
      error: string;
    }
  | ProfileData;

function isProfileData(status: ProfileStatus): status is ProfileData {
  return "user" in status;
}

function MovieSection({
  title,
  movies,
  emptyMessage,
}: {
  title: string;
  movies: Movie[];
  emptyMessage: string;
}) {
  return (
    <section className={styles.movieSection}>
      <h2>{title}</h2>
      {movies.length ? (
        <ul className={styles.movieGrid}>
          {movies.map((movie) => (
            <li key={movie.id}>
              <Link className={styles.movieCard} href={`/movies/${movie.id}`}>
                {movie.poster_path ? (
                  <img
                    className={styles.poster}
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={`Pôster de ${movie.title}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.posterPlaceholder}>Sem pôster</div>
                )}
                <span className={styles.movieTitle}>{movie.title}</span>
                <span className={styles.movieYear}>
                  {movie.release_date?.slice(0, 4) || "Ano não informado"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{emptyMessage}</p>
      )}
    </section>
  );
}

export default function UserProfilePage({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = use(params);
  const [status, setStatus] = useState<ProfileStatus | null>(null);
  const profileStatus = status?.profileId === id ? status : null;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const user = await obterUsuarioAtual();
        if (cancelled) return;

        if (String(user.id) !== id) {
          setStatus({
            profileId: id,
            kind: "forbidden",
            error: "Este perfil só pode ser acessado pela própria conta.",
          });
          return;
        }

        let movieStates: MovieState[];
        try {
          movieStates = await obterColecaoFilmes();
        } catch (cause) {
          if (!cancelled) {
            setStatus({
              profileId: id,
              kind: "error",
              user,
              favorites: [],
              watched: [],
              libraryError:
                cause instanceof Error
                  ? cause.message
                  : "Não foi possível carregar a biblioteca.",
            });
          }
          return;
        }

        const movieIds = [...new Set(movieStates.map((item) => item.tmdb_id))];
        const movieResults = await Promise.allSettled(
          movieIds.map((movieId) => obterFilme(movieId)),
        );
        if (cancelled) return;

        const movies = new Map<string, Movie>();
        let missingMovieCount = 0;
        for (const result of movieResults) {
          if (result.status === "fulfilled") {
            movies.set(String(result.value.id), result.value);
          } else {
            missingMovieCount += 1;
          }
        }

        const favorites: Movie[] = [];
        const watched: Movie[] = [];
        for (const state of movieStates) {
          const movie = movies.get(String(state.tmdb_id));
          if (!movie) continue;
          if (state.favorite) favorites.push(movie);
          if (state.watched) watched.push(movie);
        }

        setStatus({
          profileId: id,
          user,
          favorites,
          watched,
          ...(missingMovieCount > 0
            ? {
                detailWarning:
                  "Alguns filmes da biblioteca não puderam ser carregados.",
              }
            : {}),
        });
      } catch (cause) {
        if (!cancelled) {
          setStatus({
            profileId: id,
            kind: estaAutenticado() ? "error" : "unauthenticated",
            error:
              cause instanceof Error
                ? cause.message
                : "Não foi possível carregar o perfil.",
          });
        }
      }
    }

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          FilmsBR
        </Link>
        <Link className={styles.backLink} href="/">
          Voltar ao início
        </Link>
      </header>

      {!profileStatus ? (
        <p className={styles.message} role="status">
          Carregando perfil...
        </p>
      ) : !isProfileData(profileStatus) &&
        profileStatus.kind === "unauthenticated" ? (
        <section className={styles.messagePanel}>
          <h1>Perfil de usuário</h1>
          <p>Entre na sua conta para visualizar seu perfil e sua biblioteca.</p>
          <Link className={styles.loginLink} href="/login">
            Entrar
          </Link>
        </section>
      ) : !isProfileData(profileStatus) ? (
        profileStatus.kind === "forbidden" ? (
          <p className={styles.error} role="alert">
            {profileStatus.error}
          </p>
        ) : (
          <section className={styles.messagePanel}>
            <p className={styles.error} role="alert">
              {profileStatus.error}
            </p>
            <Link className={styles.loginLink} href="/login">
              Ir para login
            </Link>
          </section>
        )
      ) : (
        <>
          <section className={styles.profile}>
            <p className={styles.eyebrow}>PERFIL</p>
            <h1>@{profileStatus.user.username}</h1>
            <p className={styles.email}>{profileStatus.user.email}</p>
          </section>

          {profileStatus.libraryError && (
            <p className={styles.error} role="alert">
              {profileStatus.libraryError}
            </p>
          )}
          {profileStatus.detailWarning && (
            <p className={styles.warning} role="status">
              {profileStatus.detailWarning}
            </p>
          )}

          <div className={styles.library}>
            <MovieSection
              title="Favoritos"
              movies={profileStatus.favorites}
              emptyMessage="Você ainda não adicionou filmes aos favoritos."
            />
            <MovieSection
              title="Assistidos"
              movies={profileStatus.watched}
              emptyMessage="Você ainda não marcou filmes como assistidos."
            />
          </div>
        </>
      )}
    </main>
  );
}
