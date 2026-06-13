import { ReactNode } from "react";
import { auth } from "@/auth";
import FlowStoreInitializer from "@/components/providers/app/FlowStoreInitializer";
import BoardHeader from "@/components/ui/app/private/course/page/layout/BoardHeader";

export default async function FlowOverviewLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: ReactNode;
}) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const token = session?.accessToken;
  const res = await fetch(`${process.env.AUTH_API_URL}/flows/board/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "GET",
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error(`Flow fetch failed: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.error("Response body:", text.slice(0, 200));
    throw new Error(`Failed to fetch flowboard: ${res.status}`);
  }
  const data = await res.json();

  return (
    <>
      <FlowStoreInitializer board={data} />
      <BoardHeader />
      <div className="w-full min-h-full">{children}</div>
    </>
  );
}
