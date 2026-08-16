import { buildSeoMetadata } from "@/lib/seo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata(
    "studo-for-education",
    "/studo-for-education",
    locale,
  );
}

export default function EducationPage() {
  return <div></div>;
}
