import {useTranslations} from "next-intl";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";

export async function generateMetadata({params}: { params: Promise<{ locale: string }> }) {
    const {locale} = await params;
    const messages = (await import(`../../../../messages/seo/contact/${locale}.json`)).default;

    const baseUrl = 'https://studo.study';
    const localeUrl = `${baseUrl}/${locale}/contact`;

    return {
        title: messages.title,
        description: messages.description,
        keywords: messages.keywords,

        alternates: {
            canonical: localeUrl,
            languages: {
                en: `${baseUrl}/en/contact`,
                nl: `${baseUrl}/nl/contact`,
                fr: `${baseUrl}/fr/contact`,
                es: `${baseUrl}/es/contact`,
                'x-default': `${baseUrl}/en/contact`,
            },
        },

        openGraph: {
            title: messages.title,
            description: messages.description,
            url: localeUrl,
            siteName: 'Studo',
            type: 'website',
            locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
            alternateLocale: ['en_US', 'nl_NL', 'fr_FR', 'es_ES'].filter(l => !l.startsWith(locale)),
            images: [{
                url: `${baseUrl}${messages.ogImage}`,
                width: 1200,
                height: 630,
                alt: messages.title,
            }],
        },

        twitter: {
            card: 'summary_large_image',
            title: messages.title,
            description: messages.description,
            images: [`${baseUrl}${messages.ogImage}`],
            creator: '@studo',
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

        verification: {
            google: 'jouw-google-verification-code',
        },
    };
}

export default function ContactPage() {
    const t = useTranslations("landing.contact");

    return (
        <main
            className={`w-full dark:text-white text-studodarkblue
                min-h-screen pt-25 p-10 md:p-20 xl:px-40 xl:py-30 
                bg-gradient-to-b from-transparent via-transparent to-emerald-400/40`}
        >
            <div className="max-w-4xl mx-auto flex flex-col gap-12">

                {/* Header */}
                <AnimateOnMount delay={100} className="w-full">
                    <header className="flex flex-col gap-4">
                        <h1 className="font-bold text-5xl md:text-6xl">
                            {t("title")}
                        </h1>
                        <p className="text-studodarkblue/50 dark:text-white/50 text-sm">
                            {t("lastUpdated")}
                        </p>
                    </header>
                </AnimateOnMount>

                {/* Intro */}
                <AnimateOnMount delay={200} className="w-full">
                    <section className="flex flex-col gap-4">
                        <p className="text-lg leading-relaxed">
                            {t("intro1")}
                        </p>
                        <p className="text-lg leading-relaxed">
                            {t("intro2")}
                        </p>
                    </section>
                </AnimateOnMount>

                {/* General Support */}
                <AnimateOnMount delay={300} className="w-full">
                    <section className="flex flex-col gap-4">
                        <h2 className="font-bold text-3xl">{t("supportTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("supportText")}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Email: </span>

                            <a href="mailto:support@studo.study"
                               className="text-emerald-500 dark:text-studoblue hover:underline"
                            >
                                support@studo.study
                            </a>
                        </p>
                    </section>
                </AnimateOnMount>

                {/* Business & Partnerships */}
                <AnimateOnMount delay={400} className="w-full">
                    <section className="flex flex-col gap-4">
                        <h2 className="font-bold text-3xl">{t("businessTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("businessText")}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Email: </span>

                            <a href="mailto:business@studo.study"
                               className="text-emerald-500 dark:text-studoblue hover:underline"
                            >
                                business@studo.study
                            </a>
                        </p>
                    </section>
                </AnimateOnMount>

                {/* Press & Media */}
                <AnimateOnMount delay={500} className="w-full">
                    <section className="flex flex-col gap-4">
                        <h2 className="font-bold text-3xl">{t("pressTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("pressText")}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Email: </span>

                            <a href="mailto:press@studo.study"
                               className="text-emerald-500 dark:text-studoblue hover:underline"
                            >
                                press@studo.study
                            </a>
                        </p>
                    </section>
                </AnimateOnMount>

                {/* Feedback */}
                <AnimateOnMount delay={600} className="w-full">
                    <section className="flex flex-col gap-4">
                        <h2 className="font-bold text-3xl">{t("feedbackTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("feedbackText1")}
                        </p>
                        <p className="text-lg leading-relaxed">
                            {t("feedbackText2")}
                        </p>
                        <p className="text-lg">
                            <span className="font-bold">Email: </span>

                            <a href="mailto:feedback@studo.study"
                               className="text-emerald-500 dark:text-studoblue hover:underline"
                            >
                                feedback@studo.study
                            </a>
                        </p>
                    </section>
                </AnimateOnMount>

                {/* Bug Reports */}
                <AnimateOnMount delay={700} className="w-full">
                    <section className="flex flex-col gap-4">
                        <h2 className="font-bold text-3xl">{t("bugTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("bugText")}
                        </p>
                        <ul className="flex flex-col gap-3 pl-5">
                            <li className="list-disc text-lg">{t("bug1")}</li>
                            <li className="list-disc text-lg">{t("bug2")}</li>
                            <li className="list-disc text-lg">{t("bug3")}</li>
                            <li className="list-disc text-lg">{t("bug4")}</li>
                        </ul>
                        <p className="text-lg">
                            <span className="font-bold">Email: </span>

                            <a href="mailto:bugs@studo.study"
                               className="text-emerald-500 dark:text-studoblue hover:underline"
                            >
                                bugs@studo.study
                            </a>
                        </p>
                    </section>
                </AnimateOnMount>

                {/* Follow Us */}
                <AnimateOnMount delay={800} className="w-full">
                    <section className="flex flex-col gap-4">
                        <h2 className="font-bold text-3xl">{t("socialTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("socialText")}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-lg">
                                <span className="font-bold">Instagram: </span>

                                <a href="https://instagram.com/studo.study"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-emerald-500 dark:text-studoblue hover:underline"
                                >
                                    @studo.study
                                </a>
                            </p>
                            <p className="text-lg">
                                <span className="font-bold">TikTok: </span>

                                <a href="https://tiktok.com/@studo.study"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-emerald-500 dark:text-studoblue hover:underline"
                                >
                                    @studo.study
                                </a>
                            </p>
                            <p className="text-lg">
                                <span className="font-bold">LinkedIn: </span>

                                <a href="https://linkedin.com/company/studo"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-emerald-500 dark:text-studoblue hover:underline"
                                >
                                    Studo
                                </a>
                            </p>
                        </div>
                    </section>
                </AnimateOnMount>

                {/* Response Time */}
                <AnimateOnMount delay={900} className="w-full">
                    <section className="flex flex-col gap-4 mb-20">
                        <h2 className="font-bold text-3xl">{t("responseTitle")}</h2>
                        <p className="text-lg leading-relaxed">
                            {t("responseText1")}
                        </p>
                        <p className="text-lg leading-relaxed">
                            {t("responseText2")}
                        </p>
                    </section>
                </AnimateOnMount>

            </div>
        </main>
    );
}