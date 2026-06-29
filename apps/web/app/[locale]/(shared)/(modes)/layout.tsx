import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppLayoutClient from "@/components/ui/app/private/AppLayoutClient";
import { ReactNode } from "react";

export default async function ModesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");

  return <AppLayoutClient>{children}</AppLayoutClient>;
}
