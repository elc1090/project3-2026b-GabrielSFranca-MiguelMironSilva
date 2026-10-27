import { Botao } from "@/components/botao/Botao";
import React from "react";

interface Usuario{
    nome: string;
}
export function funct(num: number, texto: string, usuario: Usuario[]): string{
    return texto;
}

export default function Page(){
    return(
        <section>
            <h1>Titulo</h1>
            <Botao>botao</Botao>
        </section>
    );
}