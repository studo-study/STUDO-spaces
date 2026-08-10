import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Proxies personal-data updates to the api-node users endpoint. The backend
// enforces email uniqueness (case-insensitive, excluding the own row) and
// returns 409 on a conflict — we forward that status untouched so the client
// can show "email already in use".

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const response = await fetch(
    `${process.env.AUTH_API_URL}/users/${session.user.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
