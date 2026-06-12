import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session, { cards }] = await Promise.all([
    params,
    auth(),
    req.json(),
  ]);
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.AUTH_API_URL}/studysets/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cards }),
  });
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
