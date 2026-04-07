import HeroBackground from "@/components/pages/marketing/landing_welcome/hero_background";
import {useTranslations} from "next-intl";
import AnimateOnMount from "@/components/pages/overige/ui/AnimateOnMount";
import {navigate} from "next/dist/client/components/segment-cache/navigation";
import Link from "next/link";
import MobileForm from "@/app/[locale]/(auth)/waitinglist/mobileform";
import DesktopForm from "@/app/[locale]/(auth)/waitinglist/desktopform";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = (await import(`../../../../messages/seo/waiting-list/${locale}.json`)).default;

    const baseUrl = 'https://studo.study';
    const localeUrl = `${baseUrl}/${locale}`;

    return {
        title: messages.title,
        description: messages.description,
        keywords: messages.keywords,

        alternates: {
            canonical: localeUrl,
            languages: {
                en: `${baseUrl}/en`,
                nl: `${baseUrl}/nl`,
                fr: `${baseUrl}/fr`,
                es: `${baseUrl}/es`,
                'x-default': `${baseUrl}/en`, // ← default taal voor onbekende locales
            },
        },

        openGraph: {
            title: messages.title,
            description: messages.description,
            url: localeUrl,
            siteName: 'Studo',
            type: 'website',
            locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`, // ← juiste format (en_US, nl_NL, etc.)
            alternateLocale: ['en_US', 'nl_NL', 'fr_FR', 'es_ES'].filter(l => !l.startsWith(locale)), // ← alternate locales
            images: [{
                url: `${baseUrl}${messages.ogImage}`, // ← absolute URL voor OG image
                width: 1200,
                height: 630,
                alt: messages.title,
            }],
        },

        twitter: {
            card: 'summary_large_image',
            title: messages.title,
            description: messages.description,
            images: [`${baseUrl}${messages.ogImage}`], // ← absolute URL
            creator: '@studo', // ← optioneel: jouw Twitter handle
            site: '@studo',
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
                'max-video-preview': -1,
            },
        },

        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },

        applicationName: 'Studo',
        category: 'education',

        // ← Extra SEO metadata
        verification: {
            google: 'jouw-google-verification-code', // Google Search Console
            // yandex: 'code',
            // bing: 'code',
        },
    };
}

export default function LoginPage() {
    const t = useTranslations("waitinglist");
    const CurrentYear = new Date().getFullYear();

    const array = [
        {
            icon: "🧑🏻‍🎓",
            color: "from-sky-400 to-blue-500"
        },
        {
            icon: "👩🏾‍🎓",
            color: "from-emerald-400 to-teal-500"
        },
        {
            icon: "👨🏽‍🎓",
            color: "from-violet-400 to-purple-500"
        },
        {
            icon: "🎓",
            color: "from-amber-400 to-orange-500"
        }
    ];

    return (
        <div className={"w-full h-full"}>
            <div className="flex relative min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
                <div className="absolute inset-0 hidden md:flex select-none pointer-events-none z-0">
                    <HeroBackground color="to-blue-400/10" />
                </div>

                <Link href={"/welcome"}
                      className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50
          flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full
          bg-white dark:bg-gray-700 border-2 border-studogrey/30
          text-studodarkblue dark:text-white shadow-md hover:shadow-lg
          transition-all duration-200 active:scale-105 focus:outline-none
          focus:ring-2 focus:ring-studogrey/50 cursor-pointer"
                      aria-label="Go back">
                    <img
                        src={"/icons/right.svg"}
                        alt=""
                        className="w-5 h-5 sm:w-6 sm:h-6 md:h-7 md:w-7 rotate-180 opacity-60 dark:invert"
                    />
                </Link>

                <div className="md:relative fixed h-screen w-screen p-10 md:pb-20 flex md:justify-center justify-center z-10">
                    {<div className={"flex xl:hidden justify-center items-center"}><MobileForm/></div>}
                    {<div className={"3xl:relative hidden xl:flex justify-between items-center px-10 w-full"}>
                        <div className={"w-1/4 h-full flex flex-col justify-between"}>

                            <AnimateOnMount delay={650} className="w-full h-full">
                                <div className={`flex items-end gap-6 min-h-full transition-all duration-700 delay-900`}>
                                    <div className="flex -space-x-3">
                                        {array.map((item, i) => (
                                            <div
                                                key={i}
                                                className={`min-w-10 min-h-10 rounded-full border border-studoborder text-white
            flex items-center justify-center bg-gradient-to-br ${item.color}`}
                                            >
                                                {item.icon}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-sm text-studodarkblue/60 dark:text-white/60">
                                        <span className="font-semibold text-studodarkblue dark:text-white">1,000+</span>
                                        {" "}{t("hook")}</div>
                                </div>
                            </AnimateOnMount>
                        </div>
                        <DesktopForm/></div>}
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-50
        flex flex-col items-center justify-center sm:flex-row sm:justify-between
        gap-2 sm:gap-4 px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-5 bg-transparent
        text-xs sm:text-sm text-studodarkblue/60 dark:text-white/60">

                    <p className="text-[10px] sm:text-xs opacity-75 order-1 sm:order-2">
                        {t("Version")} {process.env.NEXT_PUBLIC_VERSION}
                    </p>

                    <p className="text-center sm:text-right order-3 hidden sm:block">
                        &copy; {CurrentYear} {t("rights")}
                    </p>
                </div>
            </div>
        </div>
    );
}

