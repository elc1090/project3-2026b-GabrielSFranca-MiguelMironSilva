export type tmdbID=number | string;

export type User={
    id: number;
    username: string;
    email: string;
    createdAt: Date;
}

// dados do filme na The Movie DataBase API
export type Movie={
    id: tmdbID; // id
    title: string; // titulo
    overview?: string;  // sinopse
    release_date: string; // ano lancamento
    vote_average: number | null; // avaliacao media (nota1-10)
    poster_path?: string | null; // caminho da imagem do poster
}

export type LibraryMovie=Movie &{
// avaliacao pessoal do filme
    rating: number | null;
    review: string | null;

    watched: boolean;
    favorite: boolean;
    watch_later: boolean;
}

//  dto de criacao de usuario
export interface CreateUserForm{
    username: string;
    email: string;
    senha: string;
}

// dto de obtencao de usuario
export interface UserData{
    id: number;
    username: string;
    email: string;
    createdAt: Date;
}
