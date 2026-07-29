import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysessions/${id}/reset`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
