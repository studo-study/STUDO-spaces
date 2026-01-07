import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/point.svg";
import SEO from "../../seo/seo.jsx";

export default function AboutPin() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.identify.title", "Pin | Studo");
  const description = t(
    "seo.identify.description",
    "Learn visually with Studo's Identify mode. Perfect for anatomy, geography, diagrams, and any image-based learning. Point and Pin parts on images."
  );
  const keywords = t(
    "seo.identify.keywords",
    "visual learning, identify mode, image study, anatomy learning, diagram study, Studo identify"
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "Identify", path: "/identify" }
  ];

  const faqs = [
    {
      question: t("faq.identify.what.question", "What is Identify mode?"),
      answer: t("faq.identify.what.answer", "Identify mode lets you learn from images by identifying labeled parts. It's perfect for anatomy, maps, diagrams, and any visual subject.")
    },
    {
      question: t("faq.identify.use.question", "What can I use Identify mode for?"),
      answer: t("faq.identify.use.answer", "Identify mode is great for anatomy, geography, biology diagrams, art history, engineering schematics, and any subject where you need to learn parts of an image.")
    }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/identify"
        image="/og/welcome.png"
        imageAlt={t("seo.identify.imageAlt", "Studo Identify Mode - Visual learning tool")}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-rose-700/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl whitespace-pre-line
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_pin")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_pin")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_pin")}</li>
                <li className="list-disc">{t("block3_pin")}</li>
                <li className="list-disc">{t("block4_pin")}</li>
                <li className="list-disc">{t("block5_pin")}</li>
              </ul>
              <div
                className={`w-full flex items-center justify-baseline
                  transition-all duration-700 delay-1000
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-full flex items-center justify-center text-white bg-rose-400 font-bold"
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
            <img src={hero} alt={t("Identify mode illustration")} className="w-3/4" />
          </div>
        </div>
      </main>
    </>
  );
}