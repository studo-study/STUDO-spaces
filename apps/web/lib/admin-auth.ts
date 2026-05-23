import { auth } from "@/auth";
import { Session } from "next-auth";
import { NextResponse } from "next/server";

type AdminAuthResult =
  | { session: Session & { accessToken: string }; error: null }
  | { session: null; error: NextResponse };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const session = await auth();

  if (!session || !(session as any).accessToken) {
    return {
      session: null,
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = (session.user as any)?.publicRole;
  if (role !== "admin" && role !== "owner") {
    return {
      session: null,
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    session: session as Session & { accessToken: string },
    error: null,
  };
}
