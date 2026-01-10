import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/create-vis.svg";
import SEO from "../../seo/seo.jsx";

export default function AboutVisualsets() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.about-visualsets.title", "Visualsets | Studo");
  const description = t(
    "seo.about-visualsets.description",
    "Create visual study sets with Studo. Upload images and add interactive labels for anatomy, geography, diagrams, and any image-based learning."
  );
  const keywords = t(
    "seo.about-visualsets.keywords",
    "visual learning, image flashcards, anatomy study, diagram learning, visual sets, Studo visual"
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "Visual Sets", path: "/about-about-visualsets" }
  ];

  const faqs = [
    {
      question: t("faq.about-visualsets.what.question", "What are visual sets?"),
      answer: t("faq.about-visualsets.what.answer", "Visual sets are image-based study materials where you can label parts of an image. They're perfect for anatomy, maps, diagrams, and any visual subject.")
    },
    {
      question: t("faq.about-visualsets.create.question", "How do I create a visual set?"),
      answer: t("faq.about-visualsets.create.answer", "Upload an image, then click to add labels to different parts. You can add as many labels as you need and then study using Identify or Point mode.")
    }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/about-visualsets"
        image="/og/welcome.png"
        imageAlt={t("seo.about-visualsets.imageAlt", "Studo Visual Sets - Image-based learning")}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-60 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-blue-900/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_visualset")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_visualset")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_visualset")}</li>
                <li className="list-disc">{t("block3_visualset")}</li>
                <li className="list-disc">{t("block4_visualset")}</li>
                <li className="list-disc">{t("block5_visualset")}</li>
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
                  {t("create your own")}
                </Link>
              </div>
            </article>
          </div>
          <div
            className={`hidden xl:flex xl:w-1/2 h-full flex-col justify-center overflow-hidden items-baseline
              transition-all duration-700 delay-400
              ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <img src={hero} alt={t("Create visual sets illustration")} className="w-2/3" />
          </div>
        </div>
      </main>
    </>
  );
}