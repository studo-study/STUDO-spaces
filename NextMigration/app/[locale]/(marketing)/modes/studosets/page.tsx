import type { Metadata } from 'next';
import {useTranslations} from "next-intl";
import Link from "next/link";
import AnimateOnMount from "@/components/ui/AnimateOnMount";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = (await import(`../../../../../messages/seo/studosets/${locale}.json`)).default;

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
                        <Image
                            src="/icons/start/create.svg"
                            alt="Create study sets illustration"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="min-w-[200%] h-auto"
                        />
                    </div>
                </AnimateOnMount>
            </div>
        </main>
    );
}