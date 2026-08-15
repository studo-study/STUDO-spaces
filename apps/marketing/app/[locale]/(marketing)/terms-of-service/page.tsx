import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (
    await import(`../../../../messages/seo/terms-of-service/${locale}.json`)
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

export default function TermsPage() {
  const t = useTranslations("landing.terms");
  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
                min-h-screen pt-25 p-10 md:p-20 xl:px-40 xl:py-30
                bg-gradient-to-b from-transparent via-transparent to-emerald-400/20`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <AnimateOnMount delay={100} className="w-full">
          <header className="flex flex-col gap-4">
            <h1 className="font-bold text-4xl md:text-5xl">{t("title")}</h1>
            <p className="text-studodarkblue/50 dark:text-white/50 text-sm">
              {t("lastUpdated")}
            </p>
          </header>
        </AnimateOnMount>

        {/* Intro */}
        <AnimateOnMount delay={150} className="w-full">
          <section className="flex flex-col gap-4">
            <p className="text-base leading-relaxed">{t("intro.welcome")}</p>
            <p className="text-base leading-relaxed">
              {t("intro.readCarefully")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 1. About STUDO */}
        <AnimateOnMount delay={200} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("about.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("about.description")}
            </p>
            <p className="text-base leading-relaxed">
              {t.rich("about.contact", {
                link: (chunks) => (
                  <a
                    href="mailto:support@studo.study"
                    className="text-emerald-500 dark:text-studoblue hover:underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </section>
        </AnimateOnMount>

        {/* 2. Account Registration */}
        <AnimateOnMount delay={250} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("account.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("account.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("account.rules.accurate")}</li>
              <li className="list-disc">{t("account.rules.secure")}</li>
              <li className="list-disc">{t("account.rules.notify")}</li>
              <li className="list-disc">{t("account.rules.responsible")}</li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("account.ageRequirement")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 3. Acceptable Use */}
        <AnimateOnMount delay={300} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("acceptableUse.title")}</h2>
            <p className="text-base leading-relaxed">
              {t.rich("acceptableUse.description", {
                bold: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("acceptableUse.rules.illegal")}</li>
              <li className="list-disc">{t("acceptableUse.rules.harmful")}</li>
              <li className="list-disc">{t("acceptableUse.rules.hack")}</li>
              <li className="list-disc">{t("acceptableUse.rules.bots")}</li>
              <li className="list-disc">
                {t("acceptableUse.rules.impersonate")}
              </li>
              <li className="list-disc">
                {t("acceptableUse.rules.shareCredentials")}
              </li>
              <li className="list-disc">{t("acceptableUse.rules.spam")}</li>
              <li className="list-disc">{t("acceptableUse.rules.viruses")}</li>
              <li className="list-disc">
                {t("acceptableUse.rules.circumvent")}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("acceptableUse.reserve")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 4. Your Content */}
        <AnimateOnMount delay={350} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("yourContent.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("yourContent.ownership")}
            </p>
            <p className="text-base leading-relaxed">
              {t("yourContent.license")}
            </p>
            <p className="text-base leading-relaxed">
              {t("yourContent.responsible")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("yourContent.rules.own")}</li>
              <li className="list-disc">{t("yourContent.rules.infringe")}</li>
              <li className="list-disc">{t("yourContent.rules.violate")}</li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("yourContent.remove")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 5. Shared Content */}
        <AnimateOnMount delay={400} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("sharedContent.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("sharedContent.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("sharedContent.rules.grant")}</li>
              <li className="list-disc">{t("sharedContent.rules.owner")}</li>
              <li className="list-disc">{t("sharedContent.rules.change")}</li>
              <li className="list-disc">{t("sharedContent.rules.copied")}</li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("sharedContent.respect")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 6. Intellectual Property */}
        <AnimateOnMount delay={450} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">
              {t("intellectualProperty.title")}
            </h2>
            <p className="text-base leading-relaxed">
              {t("intellectualProperty.ownership")}
            </p>
            <p className="text-base leading-relaxed">
              {t("intellectualProperty.restrictions")}
            </p>
            <p className="text-base leading-relaxed">
              {t("intellectualProperty.trademarks")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 7. Free and Premium Services */}
        <AnimateOnMount delay={500} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("select.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("select.description")}
            </p>
            <p className="text-base leading-relaxed">{t("select.purchase")}</p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("select.rules.payments")}</li>
              <li className="list-disc">{t("select.rules.renew")}</li>
              <li className="list-disc">{t("select.rules.cancel")}</li>
              <li className="list-disc">{t("select.rules.refunds")}</li>
            </ul>
            <p className="text-base leading-relaxed">{t("select.pricing")}</p>
          </section>
        </AnimateOnMount>

        {/* 8. Availability */}
        <AnimateOnMount delay={550} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("availability.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("availability.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t("availability.reasons.maintenance")}
              </li>
              <li className="list-disc">
                {t("availability.reasons.technical")}
              </li>
              <li className="list-disc">
                {t("availability.reasons.circumstances")}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("availability.liability")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 9. Disclaimer */}
        <AnimateOnMount delay={600} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("disclaimer.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("disclaimer.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t("disclaimer.noGuarantee.requirements")}
              </li>
              <li className="list-disc">
                {t("disclaimer.noGuarantee.errorFree")}
              </li>
              <li className="list-disc">
                {t("disclaimer.noGuarantee.accurate")}
              </li>
              <li className="list-disc">
                {t("disclaimer.noGuarantee.success")}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("disclaimer.studyTool")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 10. Limitation of Liability */}
        <AnimateOnMount delay={650} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("liability.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("liability.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("liability.damages.data")}</li>
              <li className="list-disc">{t("liability.damages.profits")}</li>
              <li className="list-disc">{t("liability.damages.academic")}</li>
              <li className="list-disc">
                {t("liability.damages.interruptions")}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("liability.totalLiability")}
            </p>
            <p className="text-base leading-relaxed">
              {t("liability.jurisdictions")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 11. Indemnification */}
        <AnimateOnMount delay={700} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("indemnification.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("indemnification.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("indemnification.claims.use")}</li>
              <li className="list-disc">
                {t("indemnification.claims.content")}
              </li>
              <li className="list-disc">
                {t("indemnification.claims.violation")}
              </li>
              <li className="list-disc">
                {t("indemnification.claims.rights")}
              </li>
            </ul>
          </section>
        </AnimateOnMount>

        {/* 12. Termination */}
        <AnimateOnMount delay={750} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("termination.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("termination.userRight")}
            </p>
            <p className="text-base leading-relaxed">
              {t("termination.ourRight")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("termination.reasons.breach")}</li>
              <li className="list-disc">{t("termination.reasons.harm")}</li>
              <li className="list-disc">{t("termination.reasons.law")}</li>
              <li className="list-disc">
                {t("termination.reasons.discontinue")}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("termination.effect")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 13. Changes to Terms */}
        <AnimateOnMount delay={800} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("changes.title")}</h2>
            <p className="text-base leading-relaxed">{t("changes.notify")}</p>
            <p className="text-base leading-relaxed">
              {t("changes.acceptance")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 14. Governing Law */}
        <AnimateOnMount delay={850} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("governingLaw.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("governingLaw.belgium")}
            </p>
            <p className="text-base leading-relaxed">
              {t.rich("governingLaw.eu", {
                link: (chunks) => (
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 dark:text-studoblue hover:underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </section>
        </AnimateOnMount>

        {/* 15. Miscellaneous */}
        <AnimateOnMount delay={900} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("miscellaneous.title")}</h2>
            <ul className="flex flex-col gap-3 pl-5">
              <li className="list-disc">
                {t.rich("miscellaneous.entireAgreement", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("miscellaneous.severability", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("miscellaneous.noWaiver", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("miscellaneous.assignment", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
            </ul>
          </section>
        </AnimateOnMount>

        {/* 16. Contact */}
        <AnimateOnMount delay={950} className="w-full">
          <section className="flex flex-col gap-4 mb-20">
            <h2 className="font-bold text-2xl">{t("contact.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("contact.description")}
            </p>
            <div className="flex flex-col gap-2 bg-studodarkblue/5 dark:bg-white/5 p-4 rounded-xl">
              <p>
                <span className="font-bold">{t("contact.email")}</span>{" "}
                <a
                  href="mailto:support@studo.study"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  support@studo.study
                </a>
              </p>
              <p>
                <span className="font-bold">{t("contact.website")}</span>{" "}
                <a
                  href="https://studo.study"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  studo.study
                </a>
              </p>
            </div>
          </section>
        </AnimateOnMount>
      </div>
    </main>
  );
}
