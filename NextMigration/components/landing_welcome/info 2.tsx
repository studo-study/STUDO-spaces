// components/landing_welcome/info.tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

interface Feature {
    titleKey: string;
    descriptionKey: string;
    image: string;
    imageAlt: string;
    color: string;
    bgColor: string;
    direction: string;
    showCTA: boolean | null;
}

const features: Feature[] = [
    {
        titleKey: "featureTitle1",
        descriptionKey: "block1",
        image: "/icons/start/studysmart.svg",
        imageAlt: "Smart studying illustration",
        color: "from-orange-400 to-amber-500",
        bgColor: "bg-gradient-to-br from-orange-400 to-amber-50 dark:from-orange-400 dark:to-amber-400",
        direction: "normal",
        showCTA: null,
    },
    {
        titleKey: "featureTitle2",
        descriptionKey: "block2",
        image: "/icons/laptop.svg",
        imageAlt: "Student using laptop illustration",
        color: "from-blue-400 to-cyan-500",
        bgColor: "bg-gradient-to-br from-blue-400 to-cyan-50 dark:from-blue-400 dark:to-cyan-400",
        direction: "reverse",
        showCTA: null,
    },
    {
        titleKey: "featureTitle3",
        descriptionKey: "block3",
        image: "/icons/start/ready.svg",
        imageAlt: "Ready for challenges illustration",
        color: "from-emerald-400 to-teal-500",
        bgColor: "bg-gradient-to-br from-emerald-400 to-teal-50 dark:from-emerald-400 dark:to-teal-400",
        direction: "normal",
        showCTA: true,
    },
];

interface FeatureCardProps {
    feature: Feature;
    index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
    const isReverse = feature.direction === "reverse";
    const t = useTranslations('landing.welcome');

    return (
        <AnimateOnScroll className={`transition-all duration-1000`}>
            <article
                className="grid grid-cols-1 overflow-visible lg:grid-cols-2 gap-8 lg:gap-5 items-center"
                aria-labelledby={`feature-title-${index}`}
            >
                {/* Text column */}
                <div className={`flex overflow-visible flex-col w-full gap-6 ${isReverse ? "lg:order-2 items-end text-right" : "lg:order-1 items-start text-left"}`}>
                    <div className="inline-flex overflow-visible items-center gap-2">
                        <span
                            className={`w-8 h-8 rounded-full backdrop-blur-sm bg-gradient-to-r ${feature.color} flex items-center justify-center text-white font-bold text-sm`}
                            aria-hidden="true"
                        >
                            {index + 1}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-studodarkblue/40 dark:text-white/40 font-medium">
                            {t("feature")} {index + 1}
                        </span>
                    </div>

                    <h3
                        id={`feature-title-${index}`}
                        className="text-2xl w-full sm:text-3xl overflow-visible lg:text-4xl font-bold text-studodarkblue dark:text-white leading-tight"
                    >
                        {t(feature.titleKey)}
                    </h3>

                    <p className="text-base lg:text-lg text-studodarkblue/70 dark:text-white/70 leading-relaxed">
                        {t(feature.descriptionKey)}
                    </p>

                    {feature.showCTA && (
                        <div className="mt-4 overflow-visible">
                            <Link
                                href="/register"
                                className="group overflow-visible inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-studoblue dark:to-blue-400 shadow-xl shadow-emerald-500/25 dark:shadow-studoblue/25 hover:shadow-2xl hover:shadow-emerald-500/30 dark:hover:shadow-studoblue/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                            >
                                {t("signupfree")}
                                <svg
                                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Image column */}
                <figure className={`${isReverse ? "lg:order-1" : "lg:order-2"}`}>
                    <div
                        className={`rounded-3xl ${feature.bgColor} p-8 lg:p-12 overflow-hidden border border-white/50 dark:border-white/10 h-full w-full shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm group hover:scale-[1.02] transition-transform duration-500`}
                    >
                        <img
                            src={feature.image}
                            alt={feature.imageAlt}
                            className="object-contain transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500"
                            loading="lazy"
                        />
                    </div>
                </figure>
            </article>
        </AnimateOnScroll>
    );
}

export default function Info() {
    const t = useTranslations('landing.welcome');

    return (
        <section className="relative px-4 overflow-visible mb-20" aria-labelledby="info-heading">
            <div className="max-w-6xl mx-auto flex flex-col justify-center items-center">

                {/* Header */}
                <AnimateOnScroll>
                    <div className="text-center mb-16 lg:mb-24">
                        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 dark:bg-studoblue/20 text-emerald-700 dark:text-studoblue border border-emerald-200 dark:border-studoblue/30 mb-6">
                            {t("why")}
                        </span>
                        <h2 id="info-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-studodarkblue dark:text-white">
                            {t("subtitle1")}
                            <span className="block mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-studoblue dark:to-blue-400 bg-clip-text text-transparent">
                                {t("subtitle2")}
                            </span>
                        </h2>
                    </div>
                </AnimateOnScroll>

                {/* Features */}
                <div className="flex flex-col md:w-2/3 gap-10" role="list">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}