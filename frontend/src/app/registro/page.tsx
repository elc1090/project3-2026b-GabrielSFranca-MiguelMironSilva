"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { login, register } from "@/app/api/api";
import type { UserCreate } from "@/app/types/user";
import styles from "@/components/auth/AuthForm.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserCreate>({
    username: "",
    email: "",
    password: "",
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (formData.password !== passwordConfirmation) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const username = formData.username.trim();
      await register(username, formData.email.trim(), formData.password);
      await login(username, formData.password);
      router.replace("/");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível criar sua conta.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <Link href="/" className={styles.brand}>
        FilmsBR
      </Link>

      <section className={styles.card}>
        <p className={styles.eyebrow}>COMECE SUA COLEÇÃO</p>
        <h1>Crie sua conta</h1>
        <p className={styles.description}>
          Salve seus favoritos, acompanhe o que já assistiu e dê notas aos
          filmes.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="username">Nome de usuário</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            minLength={3}
            maxLength={30}
            required
            value={formData.username}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
            placeholder="Como devemos chamar você?"
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={255}
            required
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="voce@exemplo.com"
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={formData.password}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            placeholder="Pelo menos 8 caracteres"
          />

          <label htmlFor="passwordConfirmation">Confirme sua senha</label>
          <input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            required
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            placeholder="Digite a senha novamente"
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className={styles.switch}>
          Já tem uma conta? <Link href="/login">Entrar</Link>
        </p>
        <Link href="/" className={styles.back}>
          Voltar para os filmes
        </Link>
      </section>

      <p className={styles.footer}>Sua próxima história começa aqui.</p>
    </section>
  );
}
