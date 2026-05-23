import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysets/${id}/folder`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  }
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysets/${id}/folder`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  }
  return new NextResponse(null, { status: 204 });
}
