"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validations/auth";

import { loginUser } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<LoginFormData>({
      username: "",
      password: "",
    });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setServerError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrors({});
    setServerError("");

    const result =
      loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof LoginFormData, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response =
        await loginUser(result.data);

      sessionStorage.setItem(
        "access_token",
        response.access_token
      );

      router.push("/");
      router.refresh();
    } catch (error) {
      setServerError(
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
      <header className="auth-header">
        <h1>Entrar</h1>

        <p>
          Entre na sua conta para acessar sua
          biblioteca de filmes.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="auth-form"
        noValidate
      >
        <div className="form-field">
          <label htmlFor="username">
            Usuário
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />

          {errors.username && (
            <span className="field-error">
              {errors.username}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">
            Senha
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {errors.password && (
            <span className="field-error">
              {errors.password}
            </span>
          )}
        </div>

        {serverError && (
          <p className="form-error" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading
            ? "Entrando..."
            : "Entrar"}
        </button>
      </form>

      <footer className="auth-footer">
        <span>Ainda não possui uma conta?</span>

        <Link href="/cadastro">
          Criar conta
        </Link>
      </footer>
    </section>
  );
}