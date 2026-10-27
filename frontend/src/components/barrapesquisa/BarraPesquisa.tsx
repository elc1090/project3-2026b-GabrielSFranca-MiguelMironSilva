"use client";

import type { FormEventHandler } from "react";
import styles from "./BarraPesquisa.module.css";
import {Botao} from "../botao/Botao";

type SearchBarProps = {
  query: string;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function BarraPesquisa({
  query,
  loading,
  onQueryChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <form className={styles.search} onSubmit={onSubmit}>
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Ex.: Interestelar"
        aria-label="Título do filme"
      />
      {/* <button type="submit" disabled={loading}>
        {loading ? "Pesquisando…" : "Pesquisar"}
      </button> */}
      <Botao
        type="submit"
        disabled={loading}
        >
        {loading ? "Pesquisando": "Pesquisar"}
      </Botao>

      {/* <Botao
        type="submit"
        disabled={lo}
        >
      </Botao> */}
    </form>
  );
}
