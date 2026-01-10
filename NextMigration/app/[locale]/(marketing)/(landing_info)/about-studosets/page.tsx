import {useTranslations} from "next-intl";
import Link from "next/link";
import AnimateOnMount from "@/components/ui/AnimateOnMount";
import Img from "../../../../../public/icons/start/create.svg"
export default function StudosetPage() {
    const t = useTranslations("landing.studosets")
    return (
        <main
            className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-emerald-700/40`}
        >
            <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
                <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
                    <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
                        <AnimateOnMount delay={100} className={"w-full"}>
                            <h1 className={`w-full h-fit flex justify-baseline font-bold text-5xl transition-all duration-700 delay-100 whitespace-pre-line`}>
                                {t("title_studyset")}
                            </h1>
                        </AnimateOnMount>
                        <AnimateOnMount delay={200}>
                        <p className={`w-full h-fit text-2xl font-bold
                             transition-all duration-700 delay-200`}
                        >
                            {t("block1_studyset")}
                        </p>
                            </AnimateOnMount>
                        <AnimateOnMount delay={300} className={"w-full"}>
                        <ul className={`w-full flex pl-5 gap-4 flex-col font-bold
                                      transition-all duration-700 delay-300
                                      text-base items-baseline justify-baseline mb-7`}>
                            <li className="list-disc">{t("block2_studyset")}</li>
                            <li className="list-disc">{t("block3_studyset")}</li>
                            <li className="list-disc">{t("block4_studyset")}</li>
                        </ul>
                        </AnimateOnMount>
                        <AnimateOnMount delay={1000} className={"w-full "}>
                        <div
                            className={`w-full flex items-center justify-baseline
                  transition-all duration-700 delay-1000`}
                        >
                            <Link
                                href="/register"
                                className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-emerald-400 font-bold"
                            >
                                {t("create your own")}
                            </Link>
                        </div>
                            </AnimateOnMount>
                    </article>
                </div>
                <AnimateOnMount delay={400} className="hidden xl:flex h-screen xl:w-1/2 h-full">
                    <div className="w-full h-full flex justify-baseline overflow-hidden items-center">
                        <img src="/icons/start/create.svg" alt="Create study sets illustration" className="min-w-[200%]" />
                    </div>
                </AnimateOnMount>
            </div>
        </main>
    );
}