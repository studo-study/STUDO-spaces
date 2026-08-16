import { useTranslations } from "next-intl";
import { buildSeoMetadata } from "@/lib/seo";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("duel", "/challenges/duel", locale);
}

export default function DuelPage() {
  const t = useTranslations("landing.challenges.duel");
  const launched = true;
  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-yellow-300/40`}
    >
      <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
        <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
          <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
            <AnimateOnMount delay={100} className={"w-full"}>
              <h1
                className={`w-full h-fit flex justify-baseline font-bold text-5xl transition-all duration-700 delay-100 whitespace-pre-line`}
              >
                {t("title")}
              </h1>
            </AnimateOnMount>
            <AnimateOnMount delay={200}>
              <p
                className={`w-full h-fit text-2xl font-bold transition-all duration-700 delay-200`}
              >
                {t("subtitle")}
              </p>
            </AnimateOnMount>
            <AnimateOnMount delay={300} className={"w-full"}>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold transition-all duration-700 delay-300 text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block1")}</li>
                <li className="list-disc">{t("block2")}</li>
                <li className="list-disc">{t("block3")}</li>
              </ul>
            </AnimateOnMount>
            {launched && (
              <AnimateOnMount delay={1000} className={"w-full"}>
                <div
                  className={`w-full flex items-center justify-baseline transition-all duration-700 delay-1000`}
                >
                  <Link
                    href="/register"
                    className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-cyan-400 font-bold"
                  >
                    {t("cta")}
                  </Link>
                </div>
              </AnimateOnMount>
            )}
          </article>
        </div>
        <AnimateOnMount
          delay={400}
          className="hidden xl:flex h-screen xl:w-1/2"
        >
          <div className="w-full h-full flex justify-baseline overflow-hidden items-center">
            <Image
              src="/icons/start/duel.svg"
              alt="Create study sets illustration"
              width={0}
              height={0}
              className="w-3/4"
            />
          </div>
        </AnimateOnMount>
      </div>
    </main>
  );
}
