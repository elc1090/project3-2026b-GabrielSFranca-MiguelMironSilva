// criar usuario
export interface UserCreate{
    username: string;
    email: string;
    password: string;
}

// GET USUARIO
export interface UserIn{
    id: number;
    username: string;
    email: string;
    created_at: Date;
}

export type User={
    id: string | number;
    username: string;
    email: string;
}

export interface LogInResponse{
    access_token: string;
    token_type: string;
}


// export type User={
//     id: number;
//     username: string;
//     email: string;
//     createdAt: Date;
// }
