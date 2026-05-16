import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/pinpin.svg";
import SEO from "../../seo/seo.jsx";

export default function AboutPoint() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.point.title", "Point | Studo");
  const description = t(
    "seo.point.description",
    "Study images interactively with Studo's Point mode. Click on the correct location to test your visual knowledge. Perfect for maps, anatomy, and diagrams.",
  );
  const keywords = t(
    "seo.point.keywords",
    "point mode, interactive learning, image quiz, visual studygroup, click to learn, Studo point",
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "Point", path: "/point" },
  ];

  const faqs = [
    {
      question: t("faq.point.what.question", "What is Point mode?"),
      answer: t(
        "faq.point.what.answer",
        "Point mode tests your knowledge by asking you to click on the correct location on an image. It's great for learning anatomy, geography, and diagram-based subjects.",
      ),
    },
    {
      question: t(
        "faq.point.difference.question",
        "What's the difference between Point and Identify?",
      ),
      answer: t(
        "faq.point.difference.answer",
        "In Identify mode, you name labeled parts. In Point mode, you click where something is located. Both help with visual learning but test different skills.",
      ),
    },
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/point"
        image="/og/welcome.png"
        imageAlt={t(
          "seo.point.imageAlt",
          "Studo Point Mode - Interactive image learning",
        )}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-purple-700/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl whitespace-pre-line
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_point")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_point")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_point")}</li>
                <li className="list-disc">{t("block3_point")}</li>
                <li className="list-disc">{t("block4_point")}</li>
                <li className="list-disc">{t("block5_point")}</li>
              </ul>
              <div
                className={`w-full flex items-center justify-baseline
                  transition-all duration-700 delay-1000
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-purple-400 font-bold"
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
            <img
              src={hero}
              alt={t("Point mode illustration")}
              className="w-3/4"
            />
          </div>
        </div>
      </main>
    </>
  );
}
