import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const response = await fetch(
    `${process.env.AUTH_API_URL}/courses/${id}/table`,
    {
      method: "PATCH",
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
