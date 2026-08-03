import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.AUTH_API_URL}/courses`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
