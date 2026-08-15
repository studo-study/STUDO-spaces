import { useTranslations } from "next-intl";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (
    await import(`../../../../messages/seo/privacy/${locale}.json`)
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

export default function PrivacyPage() {
  const t = useTranslations("landing.privacy");
  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
                min-h-screen pt-25 p-10 md:p-20 xl:px-40 xl:py-30
                bg-gradient-to-b from-transparent via-transparent to-blue-400/20`}
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
            <p className="text-base leading-relaxed">{t("intro.agreement")}</p>
          </section>
        </AnimateOnMount>

        {/* 1. Who Are We */}
        <AnimateOnMount delay={200} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("whoAreWe.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("whoAreWe.description")}
            </p>
            <div className="flex flex-col gap-2 bg-studodarkblue/5 dark:bg-white/5 p-4 rounded-xl">
              <p>
                <span className="font-bold">{t("whoAreWe.info.project")}</span>{" "}
                STUDO
              </p>
              <p>
                <span className="font-bold">{t("whoAreWe.info.website")}</span>{" "}
                <a
                  href="https://studo.study"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  studo.study
                </a>
              </p>
              <p>
                <span className="font-bold">{t("whoAreWe.info.email")}</span>{" "}
                <a
                  href="mailto:support@studo.study"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  support@studo.study
                </a>
              </p>
              <p>
                <span className="font-bold">{t("whoAreWe.info.location")}</span>{" "}
                Belgium, EU
              </p>
            </div>
          </section>
        </AnimateOnMount>

        {/* 2. What Data We Collect */}
        <AnimateOnMount delay={250} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("dataCollect.title")}</h2>

            <h3 className="font-bold text-lg">
              {t("dataCollect.provided.title")}
            </h3>
            <p className="text-base leading-relaxed">
              {t("dataCollect.provided.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t("dataCollect.provided.items.name")}
              </li>
              <li className="list-disc">
                {t("dataCollect.provided.items.email")}
              </li>
              <li className="list-disc">
                {t("dataCollect.provided.items.password")}
              </li>
              <li className="list-disc">
                {t("dataCollect.provided.items.profile")}
              </li>
              <li className="list-disc">
                {t("dataCollect.provided.items.content")}
              </li>
              <li className="list-disc">
                {t("dataCollect.provided.items.feedback")}
              </li>
            </ul>

            <h3 className="font-bold text-lg mt-4">
              {t("dataCollect.automatic.title")}
            </h3>
            <p className="text-base leading-relaxed">
              {t("dataCollect.automatic.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t("dataCollect.automatic.items.ip")}
              </li>
              <li className="list-disc">
                {t("dataCollect.automatic.items.browser")}
              </li>
              <li className="list-disc">
                {t("dataCollect.automatic.items.device")}
              </li>
              <li className="list-disc">
                {t("dataCollect.automatic.items.pages")}
              </li>
              <li className="list-disc">
                {t("dataCollect.automatic.items.time")}
              </li>
            </ul>

            <h3 className="font-bold text-lg mt-4">
              {t("dataCollect.thirdParty.title")}
            </h3>
            <p className="text-base leading-relaxed">
              {t("dataCollect.thirdParty.description")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 3. Why We Collect Data */}
        <AnimateOnMount delay={300} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("whyCollect.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("whyCollect.description")}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-studodarkblue/20 dark:border-white/20">
                    <th className="text-left py-3 pr-4 font-bold">
                      {t("whyCollect.table.purpose")}
                    </th>
                    <th className="text-left py-3 pr-4 font-bold">
                      {t("whyCollect.table.legalBasis")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.account.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.account.basis")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.modes.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.modes.basis")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.improving.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.improving.basis")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.responding.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.responding.basis")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.updates.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.updates.basis")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.marketing.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.marketing.basis")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.security.purpose")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("whyCollect.purposes.security.basis")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </AnimateOnMount>

        {/* 4. How We Store Data */}
        <AnimateOnMount delay={350} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("storage.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("storage.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">{t("storage.measures.https")}</li>
              <li className="list-disc">{t("storage.measures.hashing")}</li>
              <li className="list-disc">{t("storage.measures.updates")}</li>
              <li className="list-disc">{t("storage.measures.access")}</li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("storage.disclaimer")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 5. Data Retention */}
        <AnimateOnMount delay={400} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("retention.title")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-studodarkblue/20 dark:border-white/20">
                    <th className="text-left py-3 pr-4 font-bold">
                      {t("retention.table.dataType")}
                    </th>
                    <th className="text-left py-3 pr-4 font-bold">
                      {t("retention.table.period")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.account.type")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.account.period")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.content.type")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.content.period")}
                    </td>
                  </tr>
                  <tr className="border-b border-studodarkblue/10 dark:border-white/10">
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.logs.type")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.logs.period")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.support.type")}
                    </td>
                    <td className="py-3 pr-4">
                      {t("retention.shared-types.support.period")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base leading-relaxed">
              {t("retention.deletion")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 6. Sharing Data */}
        <AnimateOnMount delay={450} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("sharing.title")}</h2>
            <p className="text-base leading-relaxed">
              {t.rich("sharing.description", {
                bold: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t.rich("sharing.situations.providers", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("sharing.situations.legal", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("sharing.situations.consent", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t("sharing.compliance")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 7. Cookies */}
        <AnimateOnMount delay={500} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("cookies.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("cookies.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t.rich("cookies.shared-types.essential", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("cookies.shared-types.preference", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("cookies.shared-types.analytics", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
            </ul>
            <p className="text-base leading-relaxed">{t("cookies.manage")}</p>
          </section>
        </AnimateOnMount>

        {/* 8. Your Rights */}
        <AnimateOnMount delay={550} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("rights.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("rights.description")}
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">
                {t.rich("rights.list.access", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("rights.list.rectification", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("rights.list.erasure", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("rights.list.restriction", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("rights.list.portability", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("rights.list.object", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
              <li className="list-disc">
                {t.rich("rights.list.withdraw", {
                  bold: (chunks) => <span className="font-bold">{chunks}</span>,
                })}
              </li>
            </ul>
            <p className="text-base leading-relaxed">
              {t.rich("rights.contact", {
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

        {/* 9. Children */}
        <AnimateOnMount delay={600} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("children.title")}</h2>
            <p className="text-base leading-relaxed">
              {t("children.description")}
            </p>
            <p className="text-base leading-relaxed">
              {t.rich("children.discovery", {
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

        {/* 10. Changes */}
        <AnimateOnMount delay={650} className="w-full">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">{t("changes.title")}</h2>
            <p className="text-base leading-relaxed">{t("changes.notify")}</p>
            <p className="text-base leading-relaxed">
              {t("changes.acceptance")}
            </p>
          </section>
        </AnimateOnMount>

        {/* 11. Contact & Complaints */}
        <AnimateOnMount delay={700} className="w-full">
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
            </div>
            <p className="text-base leading-relaxed">
              {t("contact.complaint")}
            </p>
            <div className="flex flex-col gap-2 bg-studodarkblue/5 dark:bg-white/5 p-4 rounded-xl">
              <p>
                <span className="font-bold">{t("contact.authority.name")}</span>
              </p>
              <p>{t("contact.authority.address")}</p>
              <p>
                <a
                  href="https://www.gegevensbeschermingsautoriteit.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 dark:text-studoblue hover:underline"
                >
                  www.gegevensbeschermingsautoriteit.be
                </a>
              </p>
            </div>
          </section>
        </AnimateOnMount>
      </div>
    </main>
  );
}
