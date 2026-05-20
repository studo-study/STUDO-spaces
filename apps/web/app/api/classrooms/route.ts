import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const headers = { Authorization: `Bearer ${session.accessToken}` };
  const baseUrl = process.env.AUTH_API_URL;
  const userId = session.user.id;

  const listResponse = await fetch(`${baseUrl}/users/${userId}/classrooms`, {
    method: "GET",
    headers,
  });

  if (!listResponse.ok) {
    const data = await listResponse.json();
    return NextResponse.json(data, { status: listResponse.status });
  }

  const { classrooms } = await listResponse.json();

  const fullClassrooms = await Promise.all(
    classrooms.map(async (c: { id: string }) => {
      const res = await fetch(`${baseUrl}/users/${userId}/classrooms/${c.id}`, {
        method: "GET",
        headers,
      });
      if (!res.ok) return null;
      return res.json();
    }),
  );

  return NextResponse.json({
    classrooms: fullClassrooms.filter(Boolean),
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const response = await fetch(`${process.env.AUTH_API_URL}/classrooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
