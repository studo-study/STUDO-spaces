import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import hero from "../../../assets/icons/start/create.svg";
import SEO from "../../seo/seo.jsx";

export default function AboutStudysets() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = t("seo.studosets.title", "Studysets | Studo");
  const description = t(
    "seo.studosets.description",
    "Create custom studygroup sets with Studo. Add terms, definitions, and images to build the perfect studygroup material. Share with classmates or keep private."
  );
  const keywords = t(
    "seo.studosets.keywords",
    "studygroup sets, create flashcards, custom studygroup material, share studygroup sets, Studo studygroup sets"
  );

  const breadcrumbs = [
    { name: "Home", path: "/welcome" },
    { name: "Study Sets", path: "/about-studosets" }
  ];

  const faqs = [
    {
      question: t("faq.studosets.what.question", "What are studygroup sets?"),
      answer: t("faq.studosets.what.answer", "Study sets are collections of flashcards with terms and definitions. You can create them for any subject and studygroup them using various modes like Learn, Flashcards, or Speedy.")
    },
    {
      question: t("faq.studosets.share.question", "Can I share my studygroup sets?"),
      answer: t("faq.studosets.share.answer", "Yes! You can make your studygroup sets public to share with classmates or the community, or keep them private for personal use.")
    }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/about-studysets"
        image="/og/welcome.png"
        imageAlt={t("seo.studosets.imageAlt", "Studo Study Sets - Create and share")}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />
      <main
        className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center
          bg-gradient-to-b from-transparent via-transparent to-emerald-700/40`}
      >
        <div className="w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center">
          <div className="w-full xl:w-1/2 h-full flex flex-col items-end justify-center">
            <article className="w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center">
              <h1
                className={`w-full h-fit font-bold text-5xl
                  transition-all duration-700 delay-100
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("title_studyset")}
              </h1>
              <p
                className={`w-full h-fit text-2xl font-bold
                  transition-all duration-700 delay-200
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {t("block1_studyset")}
              </p>
              <ul
                className={`w-full flex pl-5 gap-4 flex-col font-bold
                  transition-all duration-700 delay-300
                  ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
                  text-base items-baseline justify-baseline mb-7`}
              >
                <li className="list-disc">{t("block2_studyset")}</li>
                <li className="list-disc">{t("block3_studyset")}</li>
                <li className="list-disc">{t("block4_studyset")}</li>
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
            <img src={hero} alt={t("Create studygroup sets illustration")} className="min-w-2/1" />
          </div>
        </div>
      </main>
    </>
  );
}