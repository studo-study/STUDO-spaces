import { SEO_BASE_URL } from "@/lib/seo";

/**
 * Site-wide structured data: Organization + WebSite (with SearchAction).
 * JSON-LD only. Rendered once per locale in the locale layout.
 */
export default function JsonLd({ locale }: { locale: string }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SEO_BASE_URL}/#organization`,
        name: "Studo",
        url: SEO_BASE_URL,
        logo: `${SEO_BASE_URL}/branding/logo-white.png`,
        // TODO: add verified social profile URLs here (sameAs) for the
        // knowledge panel once confirmed.
      },
      {
        "@type": "WebSite",
        "@id": `${SEO_BASE_URL}/#website`,
        url: SEO_BASE_URL,
        name: "Studo",
        inLanguage: locale,
        publisher: { "@id": `${SEO_BASE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SEO_BASE_URL}/${locale}/search-result?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        // The product entity — surfaces in AI answers / knowledge results
        // as a real, machine-readable "app" with category + free offer.
        "@type": "SoftwareApplication",
        "@id": `${SEO_BASE_URL}/#app`,
        name: "Studo",
        url: SEO_BASE_URL,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, iOS, Android",
        inLanguage: locale,
        publisher: { "@id": `${SEO_BASE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
