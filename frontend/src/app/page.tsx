"use client";

import styles from "./page.module.css";
import Link from "next/link";

// import React, { FormEvent, useState } from "react";

// import { Botao } from "@/components/botao/Botao";
// import { api } from "./api/libapi";
// import { Movie } from "@/app/types/movie";

// function anoLancamento(filme: Movie){
//     const ano=filme.release_date ? filme.release_date.split('-')[0] : "Sem ano";
//     return(ano);
// }

// export default function PaginaPesquisa(){
//     const [query, setQuery]=useState<string>('')
//     const [movies, setMovies]=useState<Movie[]>([])
//     const [loading, setLoading]=useState(false)

//     async function handleSearch(event:FormEvent<HTMLFormElement>) {
//         event.preventDefault();

//         const term=query.trim();
//         if(!term) return;
//         setLoading(true);

//         try{
//             const dados=await api.pesquisaFilmes(term);
//             setMovies(dados.results);
//         }catch(error){
//             setMovies([]);
//             console.error("erro na resposta do backend", error);
//         }finally{
//             setLoading(false);
//         }
//     }

//     if (loading) {
//         return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Retornando resultados...</div>;
//     }

//     return(
//         <main className={styles.pagina}>
//             <form onSubmit={handleSearch} className={styles.formulario}>
//                 <input 
//                     type="search"
//                     className={styles.barrapesquisa}
//                     value={query}
//                     onChange={(event)=>setQuery(event.target.value)}
//                     placeholder="Pesquise um filme pelo título"
//                     aria-label="Titulo filme"
//                 />
//                 <Botao type="submit" disabled={loading}>
//                     {loading ? "Pesquisando..." : "Pesquisar"}
//                 </Botao>

//                 <section className={styles.moviesgrid}>
//                     {movies.map((movie)=>(
//                         <Link key={movie.tmdb_id} href={`/movie/${movie.tmdb_id}`} className={styles.link}>
//                             <h3>{movie.title}</h3>
//                             <p>{anoLancamento(movie)}</p>
//                         </Link>
//                     ))}
//                 </section>
//             </form>
//         </main>
//     );
// }

import { FormEvent, useEffect, useState } from "react";
import { obterUsuarioAtual, obterFilme, obterColecaoFilmes, estaAutenticado, Movie, pesquisaFilmes, User, limparToken } from "@/app/api/api";
import {BarraPesquisa} from "@/components/barrapesquisa/BarraPesquisa";


export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [library, setLibrary] = useState<Movie[]>([]);

  useEffect(() => {
    if (!estaAutenticado()) return;
    obterUsuarioAtual().then(async currentUser => {
      setUser(currentUser);
      const states = await obterColecaoFilmes();
      const saved = await Promise.all(states.map(item => obterFilme(item.tmdb_id).catch(() => null)));
      setLibrary(saved.filter((movie): movie is Movie => movie !== null));
    }).catch(() => limparToken());
  }, []);

  async function search(event: FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (!term) { setError("Digite o nome de um filme para pesquisar."); return; }
    setLoading(true); setError("");
    try { setMovies((await pesquisaFilmes(term)).results ?? []); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível pesquisar filmes."); }
    finally { setLoading(false); }
  }

  return (
    <section className={styles.main}>
      {/* <header className={styles.header}><Link href="/" className={styles.brand}>FilmsBR</Link><span>Descubra e organize seus filmes</span></header> */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>SUA PRÓXIMA HISTÓRIA COMEÇA AQUI</p>
        <h1>Que filme você está procurando?</h1>
        <p>Pesquise no catálogo e monte sua biblioteca pessoal.</p>
        <BarraPesquisa
          query={query}
          loading={loading}
          onQueryChange={setQuery}
          onSubmit={search}
        />
      </section>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {movies.length > 0 && <section className={styles.results}><h2>Resultados da busca</h2><div className={styles.moviegrid}>
        {movies.map(movie => <Link key={movie.id} href={`/movie/${movie.id}`} className={styles.card}>
          {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={`Pôster de ${movie.title}`} /> : <div className={styles.posterFallback}>Sem pôster</div>}
          <span className={styles.movieTitle}>{movie.title}</span><span className={styles.meta}>{movie.release_date?.slice(0, 4) || "Ano não informado"}</span>
        </Link>)}
      </div></section>}
      {!movies.length && !loading && query && !error && <p className={styles.empty}>Nenhum filme encontrado.</p>}

      {user && <section className={styles.results}><h2>Minha biblioteca</h2>{library.length ? <div className={styles.moviegrid}>{library.map(movie => <Link key={movie.id} href={`/movies/${movie.id}`} className={styles.card}>
        {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={`Pôster de ${movie.title}`} /> : <div className={styles.posterFallback}>Sem pôster</div>}
        <span className={styles.movieTitle}>{movie.title}</span>
      </Link>)}</div> : <p className={styles.meta}>Sua biblioteca ainda está vazia. Marque um filme como favorito, assistido ou dê uma nota.</p>}</section>}

      <aside className={styles.account}>
        {user ? <div className={styles.accountRow}><p>Olá, <strong>{user.username}</strong>. Suas alterações ficam salvas na sua conta.</p><div className={styles.authLinks}><Link href={`/users/${user.id}`} className={styles.authSecondary}>Meu perfil</Link><button className={styles.secondary} onClick={() => { limparToken(); setUser(null); setLibrary([]); }}>Sair</button></div></div> : <>
          <h2>Acesse sua biblioteca</h2>
          <p>Entre para favoritar filmes, marcar os assistidos e registrar suas notas.</p>
          <div className={styles.authLinks}><Link href="/login" className={styles.authPrimary}>Entrar</Link><Link href="/register" className={styles.authSecondary}>Criar conta</Link></div>
        </>}
      </aside>
    </section>
  );
}
