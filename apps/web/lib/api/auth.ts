import { RegisterResponse, RegisterUserRequest } from "@/types/register-d";

export async function registerUser(
  data: RegisterUserRequest,
): Promise<RegisterResponse> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
