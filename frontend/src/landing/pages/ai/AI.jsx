import { t } from "i18next";
import { Link } from "react-router-dom";
import hero from "../../../../public/assets/icons/start/ai.svg";

export default function AI() {
  return (
    <div
      className="w-full min-h-[90vh] dark:text-white text-studodarkblue flex items-center justify-center bg-gradient-to-b from-transparent via-pink-400/20 to-purple-400/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 lg:py-0">
          {/* Text section */}
          <div className="flex flex-col items-start justify-center space-y-8 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t("AI That Builds Your Sets")}
            </h1>

            <p className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400">
              {t("* coming soon")}
            </p>

            <ul className="space-y-4 text-base sm:text-lg font-medium list-disc list-inside">
              <li>{t("Upload a vocabulary list, glossary, or lecture notes and turn them into a studyset")}</li>
              <li>{t("Snap a photo of a textbook page or diagram and let AI detect the terms")}</li>
              <li>{t("AI cleans up the data into ready-to-use pairs")}</li>
              <li>{t("Generated sets work across all modes")}</li>
            </ul>
          </div>

          {/* Image section */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={hero}
              alt="AI illustration"
              className="w-full max-w-lg object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}