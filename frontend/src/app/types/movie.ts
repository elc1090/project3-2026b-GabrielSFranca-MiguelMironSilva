// dados do filme na The Movie DataBase API
export type tmdbID= string | number;

export type Genero={
  id: number;
  name: string;
}

export type MembroElenco={
  id: number;
  name: string;
  character: string;
}

// // dados do filme na The Movie DataBase API
export type Movie={
  tmdb_id: tmdbID; // id
  id?: number | null; 
  title: string; // titulo
  overview?: string; // sinopse
  release_date: string; // data lancamento
  vote_average: number | null; // avaliacao media nota 1-10
  poster_path?: string | null; // caminho da imagem do poster
  // backdrop_path?: string | null; // nao sei oq eh
  runtime?: number | null; // tempo de filme em horas
}

// opcional
export type MovieDetailsType = Movie & {
  // id: number;
  original_title: string;
  original_language: string;
  adult: boolean;
  genres: Genero[];
  credits?: {
    cast: MembroElenco[];
  }
}

// estado do filme salvo
export type MovieSavedState={
  favorite: boolean; // favorito?
  watched: boolean; // assistido?
  rating?: number | null;  // avaliacao pessoal nota 1-10
}

export type MovieSearchResponse={
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}


// export type Movies={
//     id: tmdbID; // id
//     title: string; // titulo
//     overview?: string;  // sinopse
//     release_date: string; // ano lancamento
//     vote_average: number | null; // avaliacao media (nota1-10)
//     poster_path?: string | null; // caminho da imagem do poster
// }
  // genres: {
  //   id: number;
  //   name: string;
  // }[];
  // review: string;