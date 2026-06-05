import { useTranslations } from "next-intl";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import BlogItemBanner from "../../../../components/ui/marketing/blog/BlogItemBanner";

export default function Page() {
  const t = useTranslations("landing.blog");
  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
                min-h-screen pt-25 p-10 md:p-20 xl:px-40 xl:py-30 
                bg-gradient-to-b from-transparent via-transparent to-emerald-400/40`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <AnimateOnMount delay={100} className="w-full">
          <header className="flex flex-col gap-4">
            <h1 className="font-bold text-5xl md:text-6xl">{t("title")}</h1>
            <p className="text-studodarkblue/50 dark:text-white/50 text-sm">
              {t("lastUpdated")}
            </p>
          </header>
        </AnimateOnMount>

        <AnimateOnMount delay={200} className="w-full">
          <div className={"text-xl "}>Updates</div>
        </AnimateOnMount>

        <AnimateOnMount delay={200} className="w-full">
          <div
            className={
              "border border-2 rounded-xl border-studoborder flex flex-row gap-4 justify-between items-center h-20 w-full"
            }
          ></div>
        </AnimateOnMount>
        <AnimateOnMount delay={200} className="w-full">
          <div>
            <BlogItemBanner />
          </div>
        </AnimateOnMount>
      </div>
    </main>
  );
}
