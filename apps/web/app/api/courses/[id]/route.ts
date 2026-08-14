import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.AUTH_API_URL}/courses/${id}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const response = await fetch(`${process.env.AUTH_API_URL}/courses/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  });

  // backend kan een lege body teruggeven (204 / geen content) → niet blind parsen
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.AUTH_API_URL}/courses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  return new NextResponse(null, { status: response.status });
}
