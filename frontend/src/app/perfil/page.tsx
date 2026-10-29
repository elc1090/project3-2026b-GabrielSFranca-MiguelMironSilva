"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  limparToken,
  estaAutenticado,
  obterColecaoFilmes,
  obterFilme,
  obterUsuarioAtual,
  Movie,
  MovieState,
  User,
} from "@/app/api/api";
import styles from "./perfil.module.css";

type LibraryItem = { movie: Movie; state: MovieState };

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!estaAutenticado()) {
      router.replace("/login");
      return () => { cancelled = true; };
    }

    async function loadProfile() {
      try {
        const currentUser = await obterUsuarioAtual();
        const states = await obterColecaoFilmes();
        const items = await Promise.all(
          states.map(async (state) => ({
            state,
            movie: await obterFilme(state.tmdb_id),
          })),
        );
        if (!cancelled) {
          setUser(currentUser);
          setLibrary(items);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Não foi possível carregar seu perfil.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();
    return () => { cancelled = true; };
  }, [router]);

  function logout() {
    limparToken();
    router.replace("/");
  }

  const favorites = library.filter(({ state }) => state.favorite).length;
  const watched = library.filter(({ state }) => state.watched).length;
  const rated = library.filter(({ state }) => state.rating !== null).length;

  return (
    <main className={styles.page}>
      <nav className={styles.navigation} aria-label="Navegação do perfil">
        <Link href="/" className={styles.back}>← Voltar aos filmes</Link>
        {user?.is_superuser && <Link href="/admin" className={styles.adminLink}>Painel administrativo</Link>}
      </nav>

      <section className={styles.hero}>
        <div className={styles.avatar} aria-hidden="true">
          {user?.username.slice(0, 1).toUpperCase() ?? "?"}
        </div>
        <div>
          <p className={styles.eyebrow}>MEU PERFIL</p>
          <h1>{user?.username ?? "Sua conta"}</h1>
          <p className={styles.email}>{user?.email}</p>
        </div>
        <button type="button" className={styles.logout} onClick={logout}>Sair da conta</button>
      </section>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {loading && <p className={styles.message}>Carregando seu perfil…</p>}

      {!loading && !error && user && <>
        <section className={styles.stats} aria-label="Resumo da biblioteca">
          <article className={styles.stat}><strong>{library.length}</strong><span>Filmes na coleção</span></article>
          <article className={styles.stat}><strong>{favorites}</strong><span>Favoritos</span></article>
          <article className={styles.stat}><strong>{watched}</strong><span>Assistidos</span></article>
          <article className={styles.stat}><strong>{rated}</strong><span>Avaliados</span></article>
        </section>

        <section className={styles.collection}>
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>SEUS FILMES</p><h2>Minha coleção</h2></div>
            <Link href="/" className={styles.discover}>Descobrir filmes</Link>
          </div>
          {library.length ? (
            <div className={styles.grid}>
              {library.map(({ movie, state }) => (
                <Link key={movie.id} href={`/movies/${movie.id}`} className={styles.movie}>
                  {movie.poster_path
                    ? <Image src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={`Pôster de ${movie.title}`} width={342} height={513} />
                    : <div className={styles.posterFallback}>Sem pôster</div>}
                  <strong>{movie.title}</strong>
                  <span>{[
                    state.favorite ? "Favorito" : "",
                    state.watched ? "Assistido" : "",
                    state.rating !== null ? `Nota ${state.rating}/10` : "",
                  ].filter(Boolean).join(" · ") || "Na coleção"}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h3>Sua coleção ainda está vazia</h3>
              <p>Encontre filmes e marque seus favoritos, assistidos ou suas notas.</p>
              <Link href="/" className={styles.discover}>Explorar catálogo</Link>
            </div>
          )}
        </section>
      </>}
    </main>
  );
}
