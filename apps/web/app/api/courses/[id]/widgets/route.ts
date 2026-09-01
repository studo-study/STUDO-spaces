import { NextResponse } from "next/server";
import { auth } from "@/auth";

async function requireSession() {
  const session = await auth();
  if (!session?.accessToken || !session.user?.id) return null;
  return session;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, requireSession()]);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/courses/${id}/widgets`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return NextResponse.json(data, { status: response.status });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, requireSession()]);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const response = await fetch(
    `${process.env.AUTH_API_URL}/courses/${id}/widgets`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    },
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return NextResponse.json(data, { status: response.status });
}
