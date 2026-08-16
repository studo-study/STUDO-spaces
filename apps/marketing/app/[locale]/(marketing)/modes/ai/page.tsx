import { useTranslations } from "next-intl";
import { buildSeoMetadata } from "@/lib/seo";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("ai", "/modes/ai", locale);
}

export default function AiPage() {
  const t = useTranslations("landing.ai");
  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-pink-400/20 to-purple-400/40`}
    >
      <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
        <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
          <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
            <AnimateOnMount delay={100}>
              <h1
                className={`w-full h-fit font-bold text-5xl
                  transition-all duration-700 delay-100`}
              >
                {t("title_ai")}
              </h1>
            </AnimateOnMount>
            <AnimateOnMount delay={200} className={"w-full"}>
              <p
                className={`w-full h-fit text-2xl font-bold text-pink-600 dark:text-pink-400
                  transition-all duration-700 delay-200`}
              >
                {t("block1_ai")}
              </p>
            </AnimateOnMount>
            <AnimateOnMount delay={300}>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                 
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_ai")}</li>
                <li className="list-disc">{t("block3_ai")}</li>
                <li className="list-disc">{t("block4_ai")}</li>
                <li className="list-disc">{t("block5_ai")}</li>
              </ul>
            </AnimateOnMount>
          </article>
        </div>
        <AnimateOnMount
          delay={400}
          className="hidden xl:flex h-screen xl:w-1/2 h-full"
        >
          <div className="w-full h-full flex justify-baseline overflow-hidden items-center">
            <Image
              src="/icons/start/ai.svg"
              alt="ai"
              width={0}
              height={0}
              sizes="66vw"
              className="w-2/3 h-auto"
            />
          </div>
        </AnimateOnMount>
      </div>
    </main>
  );
}
