import Hero from "./Hero.jsx";
import Stats from "./Stats.jsx";
import Info from "./Info.jsx";
import { useTranslation } from "react-i18next";
import SEO from "../../seo/Seo.jsx";

export default function Welcome() {
  const { t } = useTranslation();

  const title = t("seo.welcome.title", "Smart online studying | Studo");
  const description = t(
    "seo.welcome.description",
    "Studo helps students learn faster with flashcards, visual study sets, and AI-driven learning methods. Free to use."
  );
  const keywords = t(
    "seo.welcome.keywords",
    "flashcards, study, learn, Quizlet alternative, AI learning, online studying, Studo, students"
  );

  const faqs = [
    {
      question: t("faq.what.question", "What is Studo?"),
      answer: t("faq.what.answer", "Studo is an online learning platform designed to help students study smarter. You can use flashcards, learn modes, and interactive visual study sets that make learning easier and more engaging.")
    },
    {
      question: t("faq.free.question", "Is Studo free to use?"),
      answer: t("faq.free.answer", "Yes! The core study modes are completely free. You can create as many study sets as you like and use all the main learning tools without paying.")
    },
    {
      question: t("faq.tools.question", "What study tools does Studo offer?"),
      answer: t("faq.tools.answer", "Studo offers a range of study tools: Learn mode, Flashcards, Speedy quiz, Identify (for visual learning), and Point mode for visual study sets. The visual sets are especially powerful, letting you organize and interact with your material in ways that go beyond basic flashcards.")
    },
    {
      question: t("faq.quizlet.question", "How is Studo different from Quizlet?"),
      answer: t("faq.quizlet.answer", "Compared to Quizlet, Studo offers far more advanced visual studosets and statistics about your studying. Plus the core functionality is free, which Quizlet isn't. While there are optional premium upgrades and some ads, the main learning tools are completely free, letting you focus on studying effectively.")
    }
  ];


  const breadcrumbs = [
    { name: "Home", path: "/welcome" }
  ];

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        path="/welcome"
        image="/og/welcome.png"
        imageAlt={t("seo.welcome.imageAlt", "Studo - Smart flashcards for students")}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
      />

      <main className="w-full flex flex-col items-center py-10 gap-20">
        <Hero />
        <Stats />
        <section id="info" aria-labelledby="info-heading">
          <Info />
        </section>
      </main>
    </>
  );
}