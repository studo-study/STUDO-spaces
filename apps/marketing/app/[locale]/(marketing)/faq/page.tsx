import { useTranslations } from "next-intl";
import { buildSeoMetadata } from "@/lib/seo";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import BlogItem from "@/components/ui/app/public/blog/BlogItem";
import FaqJsonLd from "@/components/seo/FaqJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildSeoMetadata("faq", "/faq", locale);
}

const FAQ_CATEGORIES = [
  { key: "general", questions: ["q1", "q2", "q3", "q4", "q5"], isOpen: true },
  {
    key: "studosets",
    questions: ["q1", "q2", "q3", "q4", "q5"],
    isOpen: false,
  },
  {
    key: "classrooms",
    questions: ["q1", "q2", "q3", "q4", "q5"],
    isOpen: false,
  },
  { key: "flow", questions: ["q1", "q2", "q3", "q4"], isOpen: false },
  { key: "ai", questions: ["q1", "q2", "q3", "q4"], isOpen: false },
  { key: "courses", questions: ["q1", "q2", "q3"], isOpen: false },
  { key: "account", questions: ["q1", "q2", "q3", "q4"], isOpen: false },
  { key: "pricing", questions: ["q1", "q2", "q3"], isOpen: false },
  { key: "technical", questions: ["q1", "q2", "q3"], isOpen: false },
];

export default function FAQPage() {
  const t = useTranslations("landing.faq");

  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
                min-h-screen pt-25 p-10 md:p-20 xl:px-40 xl:py-30 
                bg-gradient-to-b from-transparent via-transparent to-emerald-400/40`}
    >
      <FaqJsonLd />
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
          </section>
        </AnimateOnMount>

        {/* FAQ Categories */}
        {FAQ_CATEGORIES.map((category, categoryIndex) => (
          <AnimateOnMount
            key={category.key}
            delay={300 + categoryIndex * 100}
            className="w-full"
          >
            <BlogItem category={category} />
          </AnimateOnMount>
        ))}

        {/* Still have questions */}
        <AnimateOnMount delay={900} className="w-full">
          <section className="flex flex-col gap-4 mb-20">
            <h2 className="font-bold text-3xl">{t("stillTitle")}</h2>
            <p className="text-lg leading-relaxed">{t("stillText")}</p>
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
            </div>
          </section>
        </AnimateOnMount>
      </div>
    </main>
  );
}
