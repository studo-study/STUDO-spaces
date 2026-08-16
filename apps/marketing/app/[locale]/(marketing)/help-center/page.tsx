import { buildSeoMetadata } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("help-center", "/help-center", locale);
}

export default function Page() {
  return <main></main>;
}
