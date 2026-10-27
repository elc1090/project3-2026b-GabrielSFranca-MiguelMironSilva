"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/auth";
import { loginUser } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(name: keyof LoginFormData, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setMessage(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(result.data);

      sessionStorage.setItem("access_token", response.access_token);
      router.push("/");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Entrar</h1>
      <p>Acesse sua conta para consultar seus filmes.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="identifier">Usuário ou e-mail</label>
        <input
          id="identifier"
          autoComplete="username"
          value={form.identifier}
          onChange={(e) => handleChange("identifier", e.target.value)}
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        {message && <p role="alert">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>
        Ainda não tem uma conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </section>
  );
}