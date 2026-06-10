"use server";

import { signOut } from "@/../../auth";
import { auth } from "@/auth";

export async function logout() {
  const session = await auth();
  if (session) {
    await signOut({ redirectTo: "/" });
  }
}
