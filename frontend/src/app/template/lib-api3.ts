import type {
  LoginFormData,
  RegisterFormData,
} from "./validations/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

async function parseResponse<T>(
  response: Response
): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail;

    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((error) => error.msg).join(", ")
          : "Não foi possível concluir a operação.";

    throw new Error(message);
  }

  return data as T;
}

export async function registerUser(
  data: RegisterFormData
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password: data.password,
    }),
  });

  return parseResponse<User>(response);
}

export async function loginUser(
  data: LoginFormData
): Promise<LoginResponse> {
  const body = new URLSearchParams({
    username: data.identifier,
    password: data.password,
  });

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return parseResponse<LoginResponse>(response);
}