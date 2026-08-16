import { buildSeoMetadata } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("pricing", "/pricing", locale);
}

export default function Page() {
  return <main></main>;
}
