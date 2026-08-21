import { getMessages } from "next-intl/server";

type QA = { question: string; answer: string };
type Category = Record<string, QA | string>;

/**
 * FAQPage structured data — drives FAQ rich results in Google + feeds
 * AI-search engines direct Q&A pairs. Reads the same `landing.faq`
 * translations the visible page renders, so schema never drifts from copy.
 * JSON-LD only.
 */
export default async function FaqJsonLd() {
  const messages = (await getMessages()) as {
    landing?: { faq?: { categories?: Record<string, Category> } };
  };
  const categories = messages.landing?.faq?.categories ?? {};

  const mainEntity = Object.values(categories).flatMap((category) =>
    Object.entries(category)
      .filter(([key]) => key !== "title")
      .map(([, qa]) => qa as QA)
      .filter((qa) => qa?.question && qa?.answer)
      .map((qa) => ({
        "@type": "Question",
        name: qa.question,
        acceptedAnswer: { "@type": "Answer", text: qa.answer },
      })),
  );

  if (mainEntity.length === 0) return null;

  const graph = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
