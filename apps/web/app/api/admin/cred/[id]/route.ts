import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [{ session, error }, { id }] = await Promise.all([
    requireAdmin(),
    params,
  ]);
  if (error) return error;
  const response = await fetch(`${process.env.AUTH_API_URL}/admin/cred/${id}`, {
    headers: { Authorization: `Bearer ${session!.accessToken}` },
  });
  return NextResponse.json(await response.json(), { status: response.status });
}
