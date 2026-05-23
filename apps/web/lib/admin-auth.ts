import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

type AdminAuthResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const session = await auth();

  if (!session?.accessToken) {
    return {
      session: null,
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user.publicRole;
  if (role !== "admin" && role !== "owner") {
    return {
      session: null,
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { session, error: null };
}
