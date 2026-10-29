"use client"
import { Star } from "lucide-react"
import styles from "./EstrelaNota.module.css"

interface Props{
  valor: number | null;
  onChange?: (valor: number)=>void;
  desabilitado?: boolean;
}

export function EstrelaNota( {valor, onChange, desabilitado}: Props){
  return (
    <div className={styles.container}>
      <div
        className={styles.stars}
        role="radiogroup"
        aria-label="Avaliação pessoal"
      >
        {Array.from({ length: 10 }, (_, index) => {
          const nota = index + 1;
          const selected = valor !== null && nota <= valor;

          return (
            <button
              key={nota}
              type="button"
              className={styles.starButton}
              onClick={() => onChange?.(nota)}
              disabled={desabilitado || !onChange}
              aria-label={`Nota ${nota} de 10`}
              aria-checked={valor === nota}
              role="radio"
            >
              <Star
                size={24}
                strokeWidth={1.8}
                fill={selected ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>

      <span className={styles.value}>
        {valor !== null ? `${valor}/10` : "Sem avaliação"}
      </span>
    </div>
  );
}