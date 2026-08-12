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
  // The client never reads the updated session back, so skip parsing and
  // re-serialising the payload on the happy path. Only forward the body on
  // failure so errors stay debuggable.
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, { status: response.status });
  }
  return new NextResponse(null, { status: 204 });
}
