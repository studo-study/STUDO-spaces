import { useTranslations } from "next-intl";
import LoginForm from "@/components/ui/app/auth/login/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (
    await import(`../../../../messages/seo/login/${locale}.json`)
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

    verification: {
      google: "jouw-google-verification-code", // Google Search Console
      // yandex: 'code',
      // bing: 'code',
    },
  };
}

export default function LoginPage() {
  return <LoginForm />;
}
