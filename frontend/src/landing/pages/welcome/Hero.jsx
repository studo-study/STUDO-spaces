import { t } from "i18next";
import { Link } from "react-router-dom";
import { HashLink as LinkHash } from "react-router-hash-link";
import learn from "../../../../public/assets/icons/start/learn.svg";
import flash from "../../../../public/assets/icons/start/flashcards.svg";
import speedy from "../../../../public/assets/icons/start/speedy.svg";
import pin from "../../../../public/assets/icons/start/point.svg";
import point from "../../../../public/assets/icons/start/hero-pin.svg";
import HeroBackground from "./HeroBackground.jsx";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start pt-32 md:pt-40 lg:pt-48 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 hidden dark:flex select-none pointer-events-none z-0">
        <HeroBackground color="to-white/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-5xl md:max-w-screen">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-400 dark:text-studoblue">
          {t("Study Smart, Stay Ahead")}
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-studodarkblue dark:text-white">
          {t("Free study tools for smarter and faster learning")}
        </p>

        <div
          className="space-y-2 text-base sm:text-lg md:text-xl lg:text-2xl text-studodarkblue dark:text-white/90 max-w-3xl">
          <p>{t("Create your own study sets – text or visual.")}</p>
          <p>{t("From flashcards to smart learning modes,")}</p>
          <p>{t("Studo helps you master everything, anywhere, anytime.")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            to="/register"
            className="px-8 py-4 text-lg font-bold text-white bg-emerald-400 dark:bg-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue hover:bg-emerald-500 dark:hover:bg-studoblue/90 transition"
          >
            {t("Sign Up For Free")}
          </Link>

          <LinkHash
            to="/welcome#info"
            className="px-8 py-4 text-lg font-bold text-emerald-400 dark:text-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue bg-transparent hover:bg-emerald-400/10 dark:hover:bg-studoblue/10 transition backdrop-blur-sm"
          >
            {t("learn more")}
          </LinkHash>
        </div>

        <div
          className="flex flex-col md:grid md:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mt-12 w-full max-w-6xl md:w-screen px-4 sm:px-8 md:px-0">
          <Link
            to="/learn"
            className="group relative overflow-hidden rounded-3xl bg-emerald-400 flex flex-col justify-between h-64 sm:h-80 transition-transform hover:scale-105"
          >
            <span className="text-2xl sm:text-3xl font-bold text-studodarkblue text-center pt-6">
              {t("Learn")}
            </span>
            <img src={learn} alt="Learn icon" className="w-full object-cover object-bottom" />
          </Link>

          <Link
            to="/flashcards"
            className="group relative overflow-hidden rounded-3xl bg-blue-400 flex flex-col justify-between h-64 sm:h-80 transition-transform hover:scale-105"
          >
            <span className="text-2xl sm:text-3xl font-bold text-studodarkblue text-center pt-6">
              {t("Flashcards")}
            </span>
            <img src={flash} alt="Flashcards icon" className="w-full object-cover object-bottom" />
          </Link>

          <Link
            to="/speedy"
            className="group relative overflow-hidden rounded-3xl bg-amber-400 flex flex-col justify-between h-64 sm:h-80 transition-transform hover:scale-105"
          >
            <span className="text-2xl sm:text-3xl font-bold text-studodarkblue text-center pt-6">
              {t("Speedy")}
            </span>
            <img src={speedy} alt="Speedy icon" className="w-full object-cover object-bottom" />
          </Link>

          <Link
            to="/pin"
            className="group relative overflow-hidden rounded-3xl bg-red-400 flex flex-col justify-between h-64 sm:h-80 transition-transform hover:scale-105"
          >
            <span className="text-2xl sm:text-3xl font-bold text-studodarkblue text-center pt-6">
              {t("Identify")}
            </span>
            <img src={pin} alt="Identify icon" className="w-full object-cover object-bottom" />
          </Link>

          <Link
            to="/point"
            className="group relative overflow-hidden rounded-3xl bg-purple-400 flex flex-col justify-between h-64 sm:h-80 transition-transform hover:scale-105"
          >
            <span className="text-2xl sm:text-3xl font-bold text-studodarkblue text-center pt-6">
              {t("Point")}
            </span>
            <img src={point} alt="Point icon" className="w-full object-cover object-bottom" />
          </Link>
        </div>
      </div>
    </section>
  );
}