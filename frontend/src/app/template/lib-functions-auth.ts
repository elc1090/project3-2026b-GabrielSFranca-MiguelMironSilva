import { apiRequest } from "./api";
import type {
  LoginResponse,
  User,
} from "./types";
import type {
  LoginFormData,
  RegisterFormData,
} from "./validations/auth";

export async function registerUser(
  data: RegisterFormData
): Promise<User> {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: data.username,
      email: data.email,
      password: data.password,
    }),
  });
}

export async function loginUser(
  data: LoginFormData
): Promise<LoginResponse> {
  const body = new URLSearchParams();

  body.append("username", data.username);
  body.append("password", data.password);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail ?? "Usuário ou senha inválidos."
    );
  }

  return result;
}