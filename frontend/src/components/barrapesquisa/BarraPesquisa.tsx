"use client";
import type { FormEventHandler } from "react";
import styles from "./BarraPesquisa.module.css";
import {Botao} from "../botao/Botao";

type BarraPesquisaProps = {
  termo: string;
  carregando: boolean;
  onQueryChange: (query: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function BarraPesquisa({
  termo,
  carregando,
  onQueryChange,
  onSubmit,
}: BarraPesquisaProps) {
  return (
    <form className={styles.search} onSubmit={onSubmit}>
      <input
        type="search"
        value={termo}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Pesquise por um filme (ex. Titanic)"
        aria-label="Título do filme"
      />
      <Botao
        type="submit"
        disabled={carregando}
        >
        {carregando ? "Pesquisando": "Pesquisar"}
      </Botao>
    </form>
  );
}
