import { buildSeoMetadata } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("gdpr", "/GDPR", locale);
}

export default function GDPRPage() {
  return <div></div>;
}
