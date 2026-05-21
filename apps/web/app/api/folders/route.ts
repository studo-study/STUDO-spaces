import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const response = await fetch(`${process.env.AUTH_API_URL}/folders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
