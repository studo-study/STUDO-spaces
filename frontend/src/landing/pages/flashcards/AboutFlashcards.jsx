import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/flashcards-hero-img.svg";
import SEO from "../../seo/seo.jsx";

export default function AboutFlashcards() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.flashcards.title", "Flashcards | Studo");
  const description = t(
    "seo.flashcards.description",
    "Master any subject with Studo's interactive flashcards. Flip through cards, track your progress, and study smarter with our free flashcard tool."
  );
  const keywords = t(
    "seo.flashcards.keywords",
    "flashcards, study cards, digital flashcards, free flashcards, online flashcards, Studo flashcards"
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "Flashcards", path: "/flashcards" }
  ];

  const faqs = [
    {
      question: t("faq.flashcards.what.question", "What are flashcards?"),
      answer: t("faq.flashcards.what.answer", "Flashcards are a study tool where you have a question or term on one side and the answer on the other. They help with memorization through active recall.")
    },
    {
      question: t("faq.flashcards.free.question", "Are Studo flashcards free?"),
      answer: t("faq.flashcards.free.answer", "Yes, Studo flashcards are 100% free. You can create unlimited flashcard sets and study them anytime.")
    }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/flashcards"
        image="/og/welcome.png"
        imageAlt={t("seo.flashcards.imageAlt", "Studo Flashcards - Interactive study cards")}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-blue-900/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl whitespace-pre-line
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_flashcard")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_flashcard")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_flashcard")}</li>
                <li className="list-disc">{t("block3_flashcard")}</li>
                <li className="list-disc">{t("block4_flashcard")}</li>
              </ul>
              <div
                className={`w-full flex items-center justify-baseline
                  transition-all duration-700 delay-1000
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-blue-500 font-bold"
                >
                  {t("try it out")}
                </Link>
              </div>
            </article>
          </div>
          <div className="hidden xl:flex xl:w-1/2 h-full flex-col justify-center overflow-hidden items-baseline">
            <img
              src={hero}
              alt={t("Flashcards illustration")}
              className={`w-3/4 transition-all duration-700 delay-400 origin-bottom-left
                ${mounted ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`}
            />
          </div>
        </div>
      </main>
    </>
  );
}