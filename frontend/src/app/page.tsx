"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, {useState, ChangeEvent, FormEvent, useEffect} from "react";
import type {Movie} from "./lib/types";
import {API_BASE_URL} from "@/app/api/api";
import Link from "next/link";
import { Header } from "@/components/header/Header";

export default function Home() {

  const [query, setQuery]=useState<string>('');
  const [movies, setMovies]=useState<Movie[]>([]);
  const [carregando, setCarregando]=useState(false);

  async function pesquisaFilmes(event: React.FormEvent){
    event.preventDefault();

    setCarregando(true);
    
    const termo=query.trim();
    if(!termo) return;

    const url=`${API_BASE_URL}/search?/query=${encodeURIComponent(query)}`;

    try{
      const resposta=await fetch(url);
      const dados=await resposta.json();
      setMovies(dados.results);

    }catch(error){
      console.error("erro na resposta do backend", error);
    }finally{
      setCarregando(false);
    }
  }

  return (
      <main className={styles.main}>
        <Header />
        <form onSubmit={pesquisaFilmes}>
          <input 
            type="search"
            id="campo"
            value={query}
            placeholder="Busque por um filme"
            aria-label="Titulo do filme"
            onChange={(e)=> setQuery(e.target.value)}
          />

          <button type="submit" disabled={carregando}>
            {carregando? "Pesquisando": "Pesquisar"}
          </button>
        </form>

        <section className={styles.moviegrid}>
          {movies.map((movie)=>(
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className={styles.link}
          >
            <strong>{movie.title}</strong>
          </Link>
        ))}
        </section>
      </main>
  );
}


        // {/* <Image
        //   className={styles.logo}
        //   src="/next.svg"
        //   alt="Next.js logo"
        //   width={100}
        //   height={20}
        //   priority
        // />
        // <div className={styles.intro}>
        //   <h1>
        //     To get started, edit the{" "}
        //     <code className={styles.code}>page.tsx</code> file.
        //   </h1>
        //   <p>
        //     Looking for a starting point or more instructions? Head over to{" "}
        //     <a
        //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Templates
        //     </a>{" "}
        //     or the{" "}
        //     <a
        //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learning
        //     </a>{" "}
        //     center.
        //   </p>
        // </div>
        // <div className={styles.ctas}>
        //   <a
        //     className={styles.primary}
        //     href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        //     target="_blank"
        //     rel="noopener noreferrer"
        //   >
        //     <Image
        //       className={styles.logo}
        //       src="/vercel.svg"
        //       alt="Vercel logomark"
        //       width={16}
        //       height={14}
        //     />
        //     Deploy Now
        //   </a>
        //   <a
        //     className={styles.secondary}
        //     href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        //     target="_blank"
        //     rel="noopener noreferrer"
        //   >
        //     Documentation
        //   </a>
        // </div>