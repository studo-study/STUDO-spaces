import FlowHeader from "@/components/ui/app/private/course/overview/FlowHeader";
import FlowGrid from "@/components/ui/app/private/course/overview/FlowGrid";
import FlowStoreInitializer from "@/components/providers/app/FlowStoreInitializer";
import { auth } from "@/auth";

export default async function FlowPage() {
  const session = await auth();
  const token = session?.accessToken;

  const res = await fetch(`${process.env.AUTH_API_URL}/flows/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "GET",
    next: { revalidate: 60 },
  });

  const data = res.ok ? await res.json() : [];

  return (
    <>
      <FlowStoreInitializer boards={data} />
      <FlowHeader />
      <FlowGrid />
    </>
  );
}
