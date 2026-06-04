import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term");
  const lang = searchParams.get("lang");

  if (!term) {
    return NextResponse.json({ message: "term is required" }, { status: 400 });
  }

  const params = new URLSearchParams({ term });
  if (lang) params.set("lang", lang);

  const response = await fetch(
    `${process.env.AUTH_API_URL}/studysets/suggest-image?${params}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
