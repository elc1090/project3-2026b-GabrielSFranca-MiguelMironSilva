"use client";
import { Botao } from "@/components/botao/Botao";
import React, { FormEvent, useState } from "react";
import {Movie} from "@/app/types/movie";
import { api } from "../api/libapi";
import styles from "./page.module.css";
import Link from "next/link";

function anoLancamento(filme: Movie){
    const ano=filme.release_date ? filme.release_date.split('-')[0] : "Sem ano";
    return(ano);
}

export default function PaginaPesquisa(){
    const [query, setQuery]=useState<string>('')
    const [movies, setMovies]=useState<Movie[]>([])
    const [loading, setLoading]=useState(false)

    async function handleSearch(event:FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const term=query.trim()
        if(!term) return;
        setLoading(true)

        try{
            const dados=await api.pesquisaFilmes(term)
            setMovies(dados.results)
        }catch(error){
            setMovies([])
            console.error("erro na resposta do backend", error);
        }finally{
            setLoading(false)
        }
    }

    return(
        <main className={styles.pagina}>
            <form onSubmit={handleSearch} className={styles.formulario}>
                <input 
                    type="search"
                    id="campo"
                    value={query}
                    onChange={(event)=>setQuery(event.target.value)}
                    placeholder="Pesquise um filme pelo título"
                    aria-label="Titulo filme"
                />
                <Botao type="submit" disabled={loading}>
                    {loading ? "Pesquisando..." : "Pesquisar"}
                </Botao>

                <section>
                    {movies.map((movie)=>(
                        <Link key={movie.tmdb_id} href={`/movies/${movie.tmdb_id}`} className={styles.link}>
                            <h3>{movie.title}</h3>
                            <p>{anoLancamento(movie)}</p>
                        </Link>
                    ))}
                </section>
            </form>
        </main>
    );
}

// interface Usuario{
//     nome: string;
// }
// export function funct(num: number, texto: string, usuario: Usuario[]): string{
//     return texto;
// }