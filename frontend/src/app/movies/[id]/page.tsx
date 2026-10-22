"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { obterUsuarioAtual, obterFilme, obterCreditosFilme, obterEstadoFilme, estaAutenticado, Movie, MovieState, atualizarEstadoFilme, User } from "@/app/api/api";
import styles from "../../page.module.css";

export default function MoviePage({ params }: PageProps<"/movies/[id]">) {
  const [id, setId] = useState("");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<{ id: number; name: string; character: string }[]>([]);
  const [state, setState] = useState<MovieState | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { void params.then(({ id: movieId }) => setId(movieId)); }, [params]);
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    Promise.all([obterFilme(id), obterCreditosFilme(id)]).then(([details, credits]) => {
      if (!cancelled) { setMovie(details); setCast(credits.cast?.slice(0, 8) ?? []); }
    }).catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : "Não foi possível carregar o filme."); });
    if (estaAutenticado()) {
      obterUsuarioAtual().then(value => { if (!cancelled) setUser(value); }).catch(() => undefined);
      obterEstadoFilme(id).then(value => { if (!cancelled) setState(value); }).catch(() => undefined);
    }
    return () => { cancelled = true; };
  }, [id]);

  async function update(changes: Partial<Pick<MovieState, "favorite" | "watched" | "rating">>) {
    if (!id) return;
    setSaving(true); setError("");
    try { setState(await atualizarEstadoFilme(id, changes)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar sua biblioteca."); }
    finally { setSaving(false); }
  }

  return <main className={styles.main}>
    <header className={styles.header}><Link href="/" className={styles.brand}>FilmsBR</Link><Link href="/">← Voltar à busca</Link></header>
    {error && <p className={styles.error} role="alert">{error}</p>}
    {!movie && !error && <p className={styles.empty}>Carregando filme…</p>}
    {movie && <article className={styles.detail}>
      {movie.backdrop_path && <img className={styles.backdrop} src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt="" />}
      <div className={styles.detailContent}>
        {movie.poster_path && <img className={styles.detailPoster} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Pôster de ${movie.title}`} />}
        <div className={styles.detailInfo}><p className={styles.eyebrow}>DETALHES DO FILME</p><h1>{movie.title}</h1>
          <p className={styles.meta}>{movie.release_date?.slice(0, 4) || "Ano não informado"}{movie.runtime ? ` · ${movie.runtime} min` : ""}{movie.vote_average ? ` · ★ ${movie.vote_average.toFixed(1)}` : ""}</p>
          {movie.genres?.length ? <p className={styles.meta}>{movie.genres.map(g => g.name).join(" · ")}</p> : null}
          <h2>Sinopse</h2><p>{movie.overview || "Sinopse indisponível."}</p>
          <h2>Elenco</h2><p>{cast.length ? cast.map(person => `${person.name} (${person.character})`).join(" · ") : "Elenco indisponível."}</p>
          {user && state && <div className={styles.movieActions}>
            <button className={state.favorite ? styles.selected : styles.secondary} disabled={saving} onClick={() => void update({ favorite: !state.favorite })}>{state.favorite ? "♥ Favorito" : "♡ Favoritar"}</button>
            <button className={state.watched ? styles.selected : styles.secondary} disabled={saving} onClick={() => void update({ watched: !state.watched })}>{state.watched ? "✓ Assistido" : "Marcar como assistido"}</button>
            <label>Minha nota <select disabled={saving} value={state.rating ?? ""} onChange={e => void update({ rating: e.target.value ? Number(e.target.value) : null })}><option value="">Sem nota</option>{Array.from({ length: 11 }, (_, n) => <option key={n} value={n}>{n}/10</option>)}</select></label>
          </div>}
          {!user && <p className={styles.meta}>Entre na página inicial para salvar este filme na sua biblioteca.</p>}
        </div>
      </div>
    </article>}
  </main>;
}
