import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/ai.svg";
import SEO from "../../seo/seo.jsx";

export default function AI() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.ai.title", "AI Tools | Studo");
  const description = t(
    "seo.ai.description",
    "Discover Studo's AI-powered study tools. Generate flashcards automatically, get smart study recommendations, and learn faster with artificial intelligence."
  );
  const keywords = t(
    "seo.ai.keywords",
    "AI flashcards, AI study tool, automatic flashcards, smart learning, AI education, Studo AI"
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "AI", path: "/about-ai" }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/about-ai"
        image="/og/welcome.png"
        imageAlt={t("seo.ai.imageAlt", "Studo AI - Smart study tools")}
        breadcrumbs={breadcrumbs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-pink-400/20 to-purple-400/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_ai")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold text-pink-600 dark:text-pink-400
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_ai")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_ai")}</li>
                <li className="list-disc">{t("block3_ai")}</li>
                <li className="list-disc">{t("block4_ai")}</li>
                <li className="list-disc">{t("block5_ai")}</li>
              </ul>
            </article>
          </div>
          <div
            className={`hidden xl:flex xl:w-1/2 h-full flex-col justify-center overflow-hidden items-baseline
              transition-all duration-700 delay-400
              ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <img src={hero} alt={t("AI study tools illustration")} className="w-2/3" />
          </div>
        </div>
      </main>
    </>
  );
}