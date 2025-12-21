import { t } from "i18next";
import { Link } from "react-router-dom";
import hero from "../../../../public/assets/icons/start/learn-hero-img.svg";

export default function AboutLearn() {
  return (
    <div
      className="w-full min-h-[90vh] dark:text-white text-studodarkblue flex items-center justify-center bg-gradient-to-b from-transparent via-transparent to-emerald-800/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 lg:py-0">
          <div className="flex flex-col items-start justify-center space-y-8 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line">
              {t("Write - \nRepeat - \nRemember")}
            </h1>

            <p className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {t("An interactive study mode that quizzes you until every term is mastered.")}
            </p>

            <ul className="space-y-4 text-base sm:text-lg font-medium list-disc list-inside">
              <li>{t("Type your answer - no multiple choice")}</li>
              <li>{t("Master each term after two correct recalls")}</li>
              <li>{t("Build long-term memory through active learning")}</li>
            </ul>

            <div className="mt-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white bg-emerald-400 hover:bg-emerald-500 font-bold text-lg transition"
              >
                {t("try it out")}
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <img
              src={hero}
              alt="Learn mode illustration"
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}