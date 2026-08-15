import { useTranslations } from "next-intl";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (
    await import(`../../../../messages/seo/about-us/${locale}.json`)
  ).default;

  const baseUrl = "https://studo.study";
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
        "x-default": `${baseUrl}/en`, // ← default taal voor onbekende locales
      },
    },

    openGraph: {
      title: messages.title,
      description: messages.description,
      url: localeUrl,
      siteName: "Studo",
      type: "website",
      locale: locale === "en" ? "en_US" : `${locale}_${locale.toUpperCase()}`, // ← juiste format (en_US, nl_NL, etc.)
      alternateLocale: ["en_US", "nl_NL", "fr_FR", "es_ES"].filter(
        (l) => !l.startsWith(locale),
      ), // ← alternate locales
      images: [
        {
          url: `${baseUrl}${messages.ogImage}`, // ← absolute URL voor OG image
          width: 1200,
          height: 630,
          alt: messages.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: messages.title,
      description: messages.description,
      images: [`${baseUrl}${messages.ogImage}`], // ← absolute URL
      creator: "@studo", // ← optioneel: jouw Twitter handle
      site: "@studo",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    applicationName: "Studo",
    category: "education",

    // ← Extra SEO metadata
    verification: {
      google: "jouw-google-verification-code", // Google Search Console
      // yandex: 'code',
      // bing: 'code',
    },
  };
}

export default function AboutUsPage() {
  const t = useTranslations("landing.about-us");
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
            <h1 className="font-bold text-5xl md:text-6xl">{t("title")}</h1>
            <p className="text-studodarkblue/50 dark:text-white/50 text-sm">
              {t("lastUpdated")}
            </p>
          </header>
        </AnimateOnMount>

        {/* Intro */}
        <AnimateOnMount delay={200} className="w-full">
          <section className="flex flex-col gap-4">
            <p className="text-lg leading-relaxed">{t("intro1")}</p>
            <p className="text-lg leading-relaxed">{t("intro2")}</p>
            <p className="text-lg leading-relaxed">{t("intro3")}</p>
          </section>
        </AnimateOnMount>

        {/* The Story */}
        <AnimateOnMount delay={300} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("storyTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("storyText1")}</p>
            <p className="text-lg leading-relaxed">{t("storyText2")}</p>
          </section>
        </AnimateOnMount>

        {/* What Makes STUDO Different */}
        <AnimateOnMount delay={400} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("differentTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("differentText")}</p>
            <ul className="flex flex-col gap-3 pl-5">
              <li className="list-disc text-lg">{t("different1")}</li>
              <li className="list-disc text-lg">{t("different2")}</li>
              <li className="list-disc text-lg">{t("different5")}</li>
            </ul>
          </section>
        </AnimateOnMount>

        {/* We Listen */}
        <AnimateOnMount delay={500} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("listenTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("listenText1")}</p>
            <p className="text-lg leading-relaxed">{t("listenText2")}</p>
          </section>
        </AnimateOnMount>

        {/* Where We're Going */}
        <AnimateOnMount delay={600} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("goingTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("goingText1")}</p>
            <p className="text-lg leading-relaxed">{t("goingText2")}</p>
          </section>
        </AnimateOnMount>

        {/* iOS App */}
        <AnimateOnMount delay={700} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("iosTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("iosText1")}</p>
            <p className="text-lg leading-relaxed">{t("iosText2")}</p>
          </section>
        </AnimateOnMount>

        {/* Our Values */}
        <AnimateOnMount delay={800} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("valuesTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("valuesIntro")}</p>
            <ul className="flex flex-col gap-3 pl-5">
              <li className="list-disc text-lg">
                <span className="font-bold">{t("value1Title")}</span> –{" "}
                {t("value1Text")}
              </li>
              <li className="list-disc text-lg">
                <span className="font-bold">{t("value2Title")}</span> –{" "}
                {t("value2Text")}
              </li>
              <li className="list-disc text-lg">
                <span className="font-bold">{t("value3Title")}</span> –{" "}
                {t("value3Text")}
              </li>
              <li className="list-disc text-lg">
                <span className="font-bold">{t("value4Title")}</span> –{" "}
                {t("value4Text")}
              </li>
              <li className="list-disc text-lg">
                <span className="font-bold">{t("value5Title")}</span> –{" "}
                {t("value5Text")}
              </li>
            </ul>
          </section>
        </AnimateOnMount>

        {/* The Team */}
        <AnimateOnMount delay={900} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("teamTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("teamText1")}</p>
            <p className="text-lg leading-relaxed">{t("teamText2")}</p>
          </section>
        </AnimateOnMount>

        {/* Thank You */}
        <AnimateOnMount delay={1000} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-3xl">{t("thanksTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("thanksText")}</p>
          </section>
        </AnimateOnMount>

        {/* Get in Touch */}
        <AnimateOnMount delay={1100} className="w-full">
          <section className="flex flex-col gap-4 mb-20">
            <h2 className="font-bold text-3xl">{t("contactTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("contactText")}</p>
            <div className="flex flex-col gap-2">
              <p className="text-lg">
                <span className="font-bold">Email: </span>
                <a
                  href="mailto:support@studo.study"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  support@studo.study
                </a>
              </p>
              <p className="text-lg">
                <span className="font-bold">Instagram: </span>
                <a
                  href="https://instagram.com/studo.study"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  @studo.study
                </a>
              </p>
              <p className="text-lg">
                <span className="font-bold">TikTok: </span>
                <a
                  href="https://tiktok.com/@studo.study"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  @studo.study
                </a>
              </p>
            </div>
          </section>
        </AnimateOnMount>
      </div>
    </main>
  );
}
