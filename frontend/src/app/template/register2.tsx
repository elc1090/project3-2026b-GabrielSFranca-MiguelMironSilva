"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth";
import { registerUser } from "@/lib/api";

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(name: keyof RegisterFormData, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = registerSchema.safeParse(form);

    if (!result.success) {
      setMessage(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await registerUser(result.data);
      setMessage("Cadastro realizado! Você já pode entrar.");
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o cadastro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Criar conta</h1>
      <p>Cadastre-se para organizar sua biblioteca de filmes.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">Usuário</label>
        <input
          id="username"
          autoComplete="username"
          value={form.username}
          onChange={(e) => handleChange("username", e.target.value)}
        />

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirmar senha</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) =>
            handleChange("confirmPassword", e.target.value)
          }
        />

        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p>
        Já tem uma conta? <Link href="/login">Entrar</Link>
      </p>
    </section>
  );
}