import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.AUTH_API_URL) {
    return NextResponse.json(
      { message: "AUTH_API_URL not configured" },
      { status: 500 },
    );
  }

  const formData = await request.formData();

  try {
    const response = await fetch(
      `${process.env.AUTH_API_URL}/sven/import_studoset`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      },
    );

    const data = await response
      .json()
      .catch(() => ({ message: "Empty response from backend" }));
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
