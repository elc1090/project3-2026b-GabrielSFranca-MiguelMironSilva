"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, register } from "@/app/api/api";
import styles from "./AuthForm.module.css";

type AuthFormProps = { mode: "login" | "register" };

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registering = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (registering) {
        await register(username.trim(), email.trim(), password);
        await login(username.trim(), password);
      } else {
        await login(identifier.trim(), password);
      }
      router.replace("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível concluir o acesso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.brand}>FilmsBR</Link>
      <section className={styles.card}>
        <p className={styles.eyebrow}>{registering ? "COMECE SUA COLEÇÃO" : "BEM-VINDO DE VOLTA"}</p>
        <h1>{registering ? "Crie sua conta" : "Entre na sua conta"}</h1>
        <p className={styles.description}>{registering ? "Salve seus favoritos, acompanhe o que já assistiu e dê notas aos filmes." : "Acesse sua biblioteca pessoal de filmes."}</p>

        <form className={styles.form} onSubmit={submit}>
          {registering ? <>
            <label htmlFor="username">Nome de usuário</label>
            <input id="username" name="username" autoComplete="username" minLength={3} maxLength={30} required value={username} onChange={event => setUsername(event.target.value)} placeholder="Como devemos chamar você?" />
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="voce@exemplo.com" />
          </> : <>
            <label htmlFor="identifier">Usuário ou e-mail</label>
            <input id="identifier" name="username" autoComplete="username" required value={identifier} onChange={event => setIdentifier(event.target.value)} placeholder="Seu usuário ou e-mail" />
          </>}
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} minLength={8} required value={password} onChange={event => setPassword(event.target.value)} placeholder={registering ? "Pelo menos 8 caracteres" : "Sua senha"} />
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Aguarde…" : registering ? "Criar conta" : "Entrar"}</button>
        </form>

        <p className={styles.switch}>{registering ? "Já tem uma conta?" : "Ainda não tem uma conta?"} {" "}
          <Link href={registering ? "/login" : "/register"}>{registering ? "Entrar" : "Cadastre-se"}</Link>
        </p>
        <Link href="/" className={styles.back}>← Voltar para os filmes</Link>
      </section>
      <p className={styles.footer}>Sua próxima história começa aqui.</p>
    </main>
  );
}
