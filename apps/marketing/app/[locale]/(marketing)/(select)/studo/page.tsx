import { buildSeoMetadata } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("studo", "/studo", locale);
}

export default function Page() {
  return <div></div>;
}
