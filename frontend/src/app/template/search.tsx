"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, {useState, ChangeEvent, FormEvent, useEffect} from "react";
import Link from "next/link";

const BACKEND_URL=process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

interface Movie{
  id: number;
  title: string;
  overview?: string;
  release_date: string;
  vote_average: number;
  poster_path?: string | null;
}

function anoLancamento(movie : Movie){
  const ano=movie.release_date ? movie.release_date.split('-')[0] : "sem ano";
  return (ano);
}

export default function Home(){
  const [query, setQuery]=useState<string>('');
  const [movies, setMovies]=useState<Movie[]>([]);
  const [carregando, setCarregando]=useState(false);

  async function pesquisaFilmes(event: React.FormEvent){
    event.preventDefault();

    setCarregando(true);
    const term=query.trim();
    if(!term) return;

    const url=`${BACKEND_URL}/search?query=${encodeURIComponent(query)}`;

    try{
      const res=await fetch(url);
      const data=await res.json();
      setMovies(data.results);
    }catch(error){
      console.error("erro na resposta do backend", error);
    }finally{
      setCarregando(false);
    }
    // const response=await fetch(`${BACKEND_URL}/search?query=${encodeURIComponent(query)}`);
    // const data=await response.json();
    // setMovies(data.results);
    // setMovies(response);
  }

  return(
    <main className={styles.main}>
      <h1>FilmesBR</h1>

      <form onSubmit={pesquisaFilmes}>
        <input 
          type="search"
          id="campo"
          value={query}
          placeholder="Busque por um filme"
          onChange={(e)=> setQuery(e.target.value)}
        />

        <button type="submit">
          Buscar
        </button>
    </form>
    {/* {movies.map((movie)=>(
      <div key={movie.id} className={styles.filmlink}>
        <h2 className={styles.titulo}>{movie.title}</h2>
        <p className={styles.dados}>{movie.release_date}</p>
        <p className={styles.dados}>{movie.overview}</p>
      </div>
    ))} */}

    {movies.map((movie)=>(
      <Link
        key={movie.id}
        href={`/movies/${movie.id}`}
        className={styles.filmlink}
      >
        {/* <h2 className={styles.titulo}>{movie.title}</h2> */}
        <strong>{movie.title}</strong> {anoLancamento(movie)}
        {/* <p className={styles.dados}>{movie.overview}</p>        */}
      </Link>
    ))}
    </main>
  );
}