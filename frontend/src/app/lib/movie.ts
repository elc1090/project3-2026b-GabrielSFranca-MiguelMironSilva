export type tmdbID=number | string;

// dados do filme na The Movie DataBase API
export type Movie={
    tmdb_id: number | string;
    // id?: tmdbID | null; // id
    title: string; // titulo
    overview?: string;  // sinopse
    release_date?: string; // ano lancamento
    vote_average: number | null; // avaliacao media (nota1-10)
    poster_path?: string | null; // caminho da imagem do poster
    backdrop_path?: string | null;
    runtime?: number | null;
}

export type MovieSaveDetails=Movie &{
    id: number;
// avaliacao pessoal do filme
    rating: number | null;
    review: string | null;

    watched: boolean;
    favorite: boolean;
    watch_later: boolean;
}


export type Movies = {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  vote_average?: number | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  runtime?: number | null;
  genres?: { id: number; name: string }[];
};


export type LibraryMovie=Movie &{
// avaliacao pessoal do filme
    rating: number | null;
    review: string | null;

    watched: boolean;
    favorite: boolean;
    watch_later: boolean;
}