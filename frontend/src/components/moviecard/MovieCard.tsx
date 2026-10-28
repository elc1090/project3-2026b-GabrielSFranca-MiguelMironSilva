import type { Movie } from "@/app/api/api";
import Image from "next/image";
import Link from "next/link";
import { IMAGEM_URL, anoLancFilme } from "@/app/api/libapi";
import styles from "./MovieCard.module.css";

interface MovieCardProps{
    movie: Movie;
    href: string;
}

export function MovieCard({movie, href}: MovieCardProps){
    const ano=anoLancFilme(movie);
    return(
        <Link 
            href={href}
            className={styles.linkCard}
        >{movie.poster_path ? (
            <Image 
                className={styles.poster}
                src={`${IMAGEM_URL}/w342${movie.poster_path}`}
                alt={`Poster de ${movie.title}`}
                width={342}
                height={513}
            />
        ) : (
            <div className={styles.posterFallback}>sem poster</div>
        )}
        <span className={styles.titulo}>{movie.title}</span>
        <span className={styles.ano}>{ano}</span>
        </Link>
    )
}