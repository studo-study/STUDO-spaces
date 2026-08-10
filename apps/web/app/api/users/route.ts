import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const [session] = await Promise.all([auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();
  const response = await fetch(
    `${process.env.AUTH_API_URL}/users/${session.user.id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    },
  );

  // backend kan een lege body teruggeven (204 / geen content) → niet blind parsen
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return NextResponse.json(data, { status: response.status });
}
