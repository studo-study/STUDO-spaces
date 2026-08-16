import Hero from "@/components/ui/app/public/landing_welcome/hero";
import { buildSeoMetadata } from "@/lib/seo";
import Info from "@/components/ui/app/public/landing_welcome/info";
import Stats from "@/components/ui/app/public/landing_welcome/stats";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("welcome", "/welcome", locale);
}

export default function WelcomePage() {
  return (
    <div className={"flex flex-col gap-10"}>
      <Hero />
      <Stats />
      <Info />
    </div>
  );
}
