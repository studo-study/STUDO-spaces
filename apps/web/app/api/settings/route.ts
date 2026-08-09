import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Proxies to the api-node settings endpoints, which resolve the current user from
// the JWT (req.user.id). No id in the path — settings are always "self".

export async function GET() {
  const session = await auth();
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.AUTH_API_URL}/settings`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const response = await fetch(`${process.env.AUTH_API_URL}/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
