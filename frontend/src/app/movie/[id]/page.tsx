"use client";
import {useState, useEffect} from "react";
import {api, IMAGEM_URL} from "../../api/libapi";
import type {Movie, MembroElenco, MovieDetailsType} from "../../types/movie";

export default function MovieDetailsPage({tmdb_id}: {tmdb_id: string}){

    const [movie, setMovie]=useState<MovieDetailsType | null>(null)
    const [loading, setLoading]=useState(true)
    const [elenco, setElenco]=useState<MembroElenco[]>([])

    useEffect(()=>{
        async function carregarFilme(){
            setLoading(true)

            try{
                const [details, credits]=await Promise.all([
                    api.obterFilme(tmdb_id),
                    api.obterCreditosFilme(tmdb_id),
                ])
                setMovie(details)
                setElenco(credits.cast?.slice(0, 10) ?? [])
            }catch(error){
                console.error("erro ao conectar a api", error)
            }finally{
                setLoading(false)
            }
        }
        carregarFilme()
        
    }, [tmdb_id]);
    if (loading) {
        return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Carregando detalhes do filme...</div>;
    }
    if (!movie) {
        return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Carregando detalhes do filme...</div>;
    }

    const posterUrl=movie.poster_path? `${IMAGEM_URL}` : null
    const cast=movie.credits?.cast?.slice(0,10) || [];

    return (
    <main className="page movie-detail">
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}/${movie.poster_path}`}
          alt={`Pôster de ${movie.title}`}
        />
      )}

      <div>
        <h1>{movie.title}</h1>

        <p>
          {movie.release_date?.slice(0, 4)} ·
          Nota TMDB: {movie.vote_average == null ? "N/A" : `${movie.vote_average.toFixed(1)}/10`}
        </p>

        <p>{movie.overview || "Sinopse indisponível."}</p>

        <h2>Gêneros</h2>
        <p>{movie.genres?.map((gen) => gen.name).join(", ")}</p>

        <h2>Elenco</h2>
        <ul>
          {elenco.map((ator) => (
            <li key={ator.id}>
              {ator.name} — {ator.character}
            </li>
          ))}
        </ul>

        {/* Inserir aqui o componente MovieControls */}
      </div>

    </main>
  );
}