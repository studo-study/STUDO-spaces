import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const response = await fetch(`${process.env.AUTH_API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${session!.accessToken}` },
  });
  return NextResponse.json(await response.json(), { status: response.status });
}
