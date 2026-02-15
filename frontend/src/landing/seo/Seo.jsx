import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../../i18n";

const BASE_URL = "https://studo.study";

// Organization schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Studo",
  "url": BASE_URL,
  "logo": `${BASE_URL}/logo.png`,
  "sameAs": [
    "https://twitter.com/studo",
    "https://www.instagram.com/studo",
    "https://www.linkedin.com/company/studo"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@studo.studygroup"
  }
};

// WebApplication schema
const getWebAppSchema = (description) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Studo",
  "url": BASE_URL,
  "description": description,
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "inLanguage": SUPPORTED_LANGUAGES.map(lang => lang.code),
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
});

// Breadcrumb schema
const getBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${BASE_URL}${item.path}`
  }))
});

// FAQ schema
const getFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Generate URL for a specific language
const getLanguageUrl = (path, langCode) => {
  if (langCode === DEFAULT_LANGUAGE) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${langCode}${path}`;
};

export default function SEO({
                              title,
                              description,
                              keywords,
                              path = "",
                              image = "/og/welcome.png",
                              imageAlt,
                              type = "website",
                              breadcrumbs = [],
                              faqs = [],
                              noIndex = false,
                              children
                            }) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language;
  const currentUrl = getLanguageUrl(path, currentLang);
  const canonicalUrl = getLanguageUrl(path, currentLang);
  const ogImage = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  const structuredData = [
    organizationSchema,
    getWebAppSchema(description)
  ];

  if (breadcrumbs.length > 0) {
    structuredData.push(getBreadcrumbSchema(breadcrumbs));
  }

  if (faqs.length > 0) {
    structuredData.push(getFAQSchema(faqs));
  }

  return (
    <Helmet>
      {/* Basic */}
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang for each supported language */}
      {SUPPORTED_LANGUAGES.map((lang) => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={getLanguageUrl(path, lang.code)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={getLanguageUrl(path, DEFAULT_LANGUAGE)} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Studo" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={currentLang.replace("-", "_")} />
      {SUPPORTED_LANGUAGES
        .filter(lang => lang.code !== currentLang)
        .map((lang) => (
          <meta
            key={`og-${lang.code}`}
            property="og:locale:alternate"
            content={lang.code.replace("-", "_")}
          />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Additional */}
      <meta name="author" content="Studo" />
      <meta name="theme-color" content="#10b981" />

      {/* Structured Data */}
      {structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {children}
    </Helmet>
  );
}

export { BASE_URL };