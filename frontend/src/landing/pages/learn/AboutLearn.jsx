import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/learn-hero-img.svg";
import SEO from "../../seo/seo.jsx";

export default function AboutLearn() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.learn.title", "Learn | Studo");
  const description = t(
    "seo.learn.description",
    "Master your study material with Studo's Learn mode. Using spaced repetition and smart algorithms, we help you remember more in less time."
  );
  const keywords = t(
    "seo.learn.keywords",
    "spaced repetition, learn mode, smart studying, memorization, study technique, Studo learn"
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "Learn", path: "/learn" }
  ];

  const faqs = [
    {
      question: t("faq.learn.what.question", "What is Learn mode?"),
      answer: t("faq.learn.what.answer", "Learn mode uses spaced repetition to help you memorize content efficiently. It shows you cards at optimal intervals based on how well you know them.")
    },
    {
      question: t("faq.learn.spaced.question", "What is spaced repetition?"),
      answer: t("faq.learn.spaced.answer", "Spaced repetition is a learning technique where you review material at increasing intervals. It's scientifically proven to improve long-term memory retention.")
    }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/learn"
        image="/og/welcome.png"
        imageAlt={t("seo.learn.imageAlt", "Studo Learn Mode - Spaced repetition study tool")}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-emerald-800/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl whitespace-pre-line
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_learn")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_learn")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_learn")}</li>
                <li className="list-disc">{t("block3_learn")}</li>
                <li className="list-disc">{t("block4_learn")}</li>
              </ul>
              <div
                className={`w-full flex items-center justify-baseline
                  transition-all duration-700 delay-1000
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-emerald-400 font-bold"
                >
                  {t("try it out")}
                </Link>
              </div>
            </article>
          </div>
          <div
            className={`hidden xl:flex xl:w-1/2 h-full flex-col justify-center overflow-hidden items-baseline
              transition-all duration-700 delay-400
              ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <img src={hero} alt={t("Learn mode illustration")} className="w-3/4" />
          </div>
        </div>
      </main>
    </>
  );
}