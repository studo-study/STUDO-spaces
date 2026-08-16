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
  return buildSeoMetadata("speedy", "/tools/speedy", locale);
}

export default function SpeedyPage() {
  const t = useTranslations("landing.speedy");
  const launched = true;
  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-amber-500/40`}
    >
      <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
        <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
          <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
            <AnimateOnMount delay={100}>
              <h1
                className={`w-full h-fit font-bold text-5xl whitespace-pre-line
                                            transition-all duration-700 delay-100`}
              >
                {t("title_speedy")}
              </h1>
            </AnimateOnMount>
            <AnimateOnMount delay={200}>
              <p
                className={`w-full h-fit text-2xl font-bold
                                            transition-all duration-700 delay-200`}
              >
                {t("block1_speedy")}
              </p>
            </AnimateOnMount>

            <AnimateOnMount delay={300} className={"w-full"}>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                                              transition-all duration-700 delay-300
                                              text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_speedy")}</li>
                <li className="list-disc">{t("block3_speedy")}</li>
                <li className="list-disc">{t("block4_speedy")}</li>
              </ul>
            </AnimateOnMount>
            {launched && (
              <AnimateOnMount delay={1000} className={"w-full"}>
                <div
                  className={`w-full flex items-center justify-baseline transition-all duration-700`}
                >
                  <Link
                    href="/register"
                    className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-amber-300 font-bold"
                  >
                    {t("try it out")}
                  </Link>
                </div>
              </AnimateOnMount>
            )}
          </article>
        </div>
        <AnimateOnMount
          delay={400}
          className="hidden xl:flex h-screen xl:w-1/2 h-full"
        >
          <div className="w-full h-full flex justify-baseline overflow-hidden items-center">
            <Image
              src="/icons/start/speedy-hero-img.svg"
              alt="Create study sets illustration"
              className="w-3/4"
              width={0}
              height={0}
            />
          </div>
        </AnimateOnMount>
      </div>
    </main>
  );
}
