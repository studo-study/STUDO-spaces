import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysets/${id}/likes`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysets/${id}/likes`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  return new NextResponse(null, { status: response.status });
}
