import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session, body] = await Promise.all([
    params,
    auth(),
    req.json(),
  ]);
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysessions/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
