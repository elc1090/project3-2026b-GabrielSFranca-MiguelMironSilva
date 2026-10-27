"use client";

import Link from "next/link";
import { useState } from "react";

import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/validations/auth";

import { registerUser } from "@/lib/auth";

export default function RegisterForm() {
  const [formData, setFormData] =
    useState<RegisterFormData>({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const [serverError, setServerError] =
    useState("");

  const [success, setSuccess] =
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
    setSuccess("");

    const result =
      registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof RegisterFormData, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterFormData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await registerUser(result.data);

      setSuccess(
        "Cadastro realizado com sucesso! Você já pode entrar."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setServerError(
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
      <header className="auth-header">
        <h1>Criar conta</h1>
        <p>
          Crie sua conta para salvar e organizar
          seus filmes.
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
          <label htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          {errors.email && (
            <span className="field-error">
              {errors.email}
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
            autoComplete="new-password"
          />

          {errors.password && (
            <span className="field-error">
              {errors.password}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword">
            Confirmar senha
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {errors.confirmPassword && (
            <span className="field-error">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {serverError && (
          <p className="form-error" role="alert">
            {serverError}
          </p>
        )}

        {success && (
          <p className="form-success" role="status">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading
            ? "Criando conta..."
            : "Criar conta"}
        </button>
      </form>

      <footer className="auth-footer">
        <span>Já possui uma conta?</span>

        <Link href="/login">
          Entrar
        </Link>
      </footer>
    </section>
  );
}