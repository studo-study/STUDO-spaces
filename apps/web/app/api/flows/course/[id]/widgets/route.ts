import { NextResponse } from "next/server";
import { auth } from "@/auth";

// GET  → persisted widget layout for a course: { widgets: WidgetInstance[] }
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ id }, session] = await Promise.all([params, auth()]);

  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/flows/course/${id}/widgets`,
    {
      headers: {
        Authorization: ["Bearer", session.accessToken].join(" "),
      },
    },
  );
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

// PUT  → replace the widget layout: body { widgets: WidgetInstance[] }
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
    `${process.env.AUTH_API_URL}/flows/course/${id}/widgets`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: ["Bearer", session.accessToken].join(" "),
      },
      body: JSON.stringify(body),
    },
  );
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
