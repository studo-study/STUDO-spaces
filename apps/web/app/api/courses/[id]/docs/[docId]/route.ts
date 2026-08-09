import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const [{ id, docId }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/courses/${id}/docs/${docId}`,
    {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

// Reprocess: re-enqueue the document for parsing. Backend route is param-style
// (`/courses/:course_id/:doc_id`), so we drop the `/docs/` segment when proxying.
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const [{ id, docId }, session] = await Promise.all([params, auth()]);
  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.AUTH_API_URL}/courses/${id}/docs/${docId}/reprocess`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    },
  );

  // Reprocess returns no body on success; forward status, tolerate empty body.
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
