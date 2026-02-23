// components/landing_welcome/hero.tsx
import { FaCheck } from "react-icons/fa";
import { FaArrowDownLong, FaArrowRightLong } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AnimateOnMount from "@/components/overige/ui/AnimateOnMount";
import HeroBackground from "@/components/marketing/landing_welcome/hero_background";
import {Link} from "@/i18n/routing";
import SearchSets from "@/components/marketing/landing_welcome/search";

const studyModes = [
    { to: "/tools/learn", label: "Learn", icon: "/icons/start/learn.svg", color: "from-emerald-500 to-emerald-400" },
    { to: "/tools/flashcards", label: "Flashcards", icon: "/icons/start/flashcards.svg", color: "from-blue-500 to-blue-400" },
    { to: "/tools/speedy", label: "Speedy", icon: "/icons/start/speedy.svg", color: "from-amber-500 to-orange-400" },
    { to: "/tools/identify", label: "Identify", icon: "/icons/start/point.svg", color: "from-rose-500 to-red-400" },
    { to: "/tools/point", label: "Point", icon: "/icons/start/hero-pin.svg", color: "from-violet-500 to-purple-400" },
];

export default function Hero() {
    const t = useTranslations('landing.welcome');

    const features = [
        t("CreateCustom"),
        t("TextVisualLearning"),
        t("AnywhereAnytime")
    ];
    const launched = true;
    return (
        <section className="relative w-full max-w-screen overflow-visible h-fit xxl:h-3/4 flex flex-col items-center justify-start pt-10 px-4">

            {/* Background - client component, decoratief */}
            <div className="absolute max-w-screen w-full inset-0 hidden dark:flex select-none pointer-events-none z-0" aria-hidden="true">
                <HeroBackground color="to-white/10" />
            </div>

            <div className="relative z-10 flex flex-col 3xl:min-h-screen items-center text-center pt-15 sm:pt-15 lg:pt-20 3xl:pt-30 overflow-visible gap-8 3xl:w-2/3 max-w-screen">

                {/* Badge - SSR content, client animatie */}
                <AnimateOnMount delay={100}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/20 dark:bg-studoblue/20 border border-emerald-400 dark:border-studoblue/30">
                        <span className="text-sm font-medium text-emerald-400 dark:text-studoblue">
                            {t("NewStudyTool")}
                        </span>
                    </div>
                </AnimateOnMount>

                {/* Heading - SSR content, client animatie */}
                <AnimateOnMount delay={200}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span className="block text-studodarkblue dark:text-white">
                            {t("Quote1")}
                        </span>
                        <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 dark:from-studoblue dark:via-blue-500 dark:to-studoblue bg-clip-text text-transparent">
                            {t("Quote2")}
                        </span>
                    </h1>
                </AnimateOnMount>

                <AnimateOnMount delay={300}>
                    <p className="text-lg text-xl md:text-2xl text-studodarkblue/70 dark:text-white/70 max-w-2xl">
                        {t("Subtitle")}
                    </p>
                </AnimateOnMount>

                <AnimateOnMount delay={400}>
                    <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base list-none">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-emerald-500 dark:text-studoblue">
                                <FaCheck aria-hidden="true" />
                                <span className="text-studodarkblue/60 dark:text-white/60">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </AnimateOnMount>

                <AnimateOnMount delay={500} className={"w-full flex justify-center flex-col gap-5 items-center"}>
                    <SearchSets/>
                    <nav className="grid grid-cols-1 md:grid-cols-2 px-10 gap-4 md:mt-6 md:w-full max-w-150">
                        <Link href={"/register"} className="px-8 py-4 text-lg flex items-center justify-center gap-2 font-bold text-white bg-emerald-400 dark:bg-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue hover:bg-emerald-500 dark:hover:bg-studoblue/50 transition-all duration-300">
                            {t("SignUp")}
                            <FaArrowRightLong aria-hidden="true" />
                        </Link>
                        <Link href="/welcome#info" className="px-8 py-4 text-lg flex items-center justify-center gap-2 font-bold text-emerald-400 dark:text-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue bg-transparent hover:bg-emerald-400/10 dark:hover:bg-studoblue/10 transition-all duration-300 backdrop-blur-sm">
                            {t("LearnMore")}
                            <FaArrowDownLong aria-hidden="true" />
                        </Link>
                    </nav>
                </AnimateOnMount>

                {/* Study modes */}
                <nav
                    className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap justify-center gap-5 mt-12 w-full sm:px-3 md:px-0 transition-all duration-700"
                    aria-label={t("Methods")}
                >
                    {studyModes.map((item, index) => (
                        <AnimateOnMount key={index} delay={600 + index * 200} className="w-full sm:w-auto">
                            <Link
                                href={item.to}
                                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.color} flex flex-col justify-between w-full md:min-h-90 xl:min-h-58 sm:min-w-full sm:h-64 md:w-52 md:h-72 lg:w-56 lg:h-80 hover:scale-105 transition-all duration-700`}
                            >
                                <span className="text-xl sm:text-2xl font-bold text-studodarkblue text-center pt-5 sm:pt-6">
                                    {t(item.label)}
                                </span>
                                <Image src={item.icon} alt="" width={200} height={200} className="w-full object-cover object-bottom" />
                            </Link>
                        </AnimateOnMount>
                    ))}
                </nav>
            </div>
        </section>
    );
}