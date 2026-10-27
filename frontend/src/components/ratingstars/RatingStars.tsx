"use client";

import { Star } from "lucide-react";
import styles from "./RatingStars.module.css";

interface RatingStarsProps {
  value: number | null;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function RatingStars({
  value,
  onChange,
  disabled = false,
}: RatingStarsProps) {
  return (
    <div className={styles.container}>
      <div
        className={styles.stars}
        role="radiogroup"
        aria-label="Avaliação pessoal"
      >
        {Array.from({ length: 10 }, (_, index) => {
          const rating = index + 1;
          const selected = value !== null && rating <= value;

          return (
            <button
              key={rating}
              type="button"
              className={styles.starButton}
              onClick={() => onChange?.(rating)}
              disabled={disabled || !onChange}
              aria-label={`Nota ${rating} de 10`}
              aria-checked={value === rating}
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
        {value !== null ? `${value}/10` : "Sem avaliação"}
      </span>
    </div>
  );
}