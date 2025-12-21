import { t } from "i18next";
import { Link } from "react-router-dom";
import smart from "../../../../public/assets/icons/start/studysmart.svg";
import ready from "../../../../public/assets/icons/start/ready.svg";
import laptop from "../../../../public/assets/icons/laptop.svg";

export default function Info() {
  return (
    <section id="info" className="relative z-50 w-full py-16 lg:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div
            className="order-1 p-8 lg:p-12 rounded-3xl backdrop-blur-sm border border-studogrey/20 flex flex-col justify-center gap-6 bg-white/70 dark:bg-gray-800/70">
            <h3 className="text-2xl lg:text-3xl font-bold text-studodarkblue dark:text-white">
              {t("Study the smart way")}
            </h3>
            <p className="text-studodarkblue/80 dark:text-white/80 text-base lg:text-lg">
              {t("block1")}
            </p>
          </div>

          <div
            className="order-2 flex items-center justify-center rounded-3xl border-4 border-studogrey bg-orange-400 p-8">
            <img src={smart} alt="Study smart illustration" className="w-full max-w-sm object-contain" />
          </div>

          <div
            className="order-4 md:order-3 flex items-center justify-center rounded-3xl border-4 border-studogrey bg-blue-400 p-8">
            <img src={laptop} alt="Laptop illustration" className="w-full max-w-sm object-contain" />
          </div>

          <div
            className="order-3 md:order-4 p-8 lg:p-12 rounded-3xl backdrop-blur-sm border border-studogrey/20 flex flex-col justify-center gap-6 bg-white/70 dark:bg-gray-800/70">
            <h3 className="text-2xl lg:text-3xl font-bold text-studodarkblue dark:text-white">
              {t("Created by students, for students")}
            </h3>
            <p className="text-studodarkblue/80 dark:text-white/80 text-base lg:text-lg">
              {t("block2")}
            </p>
          </div>

          <div
            className="order-5 p-8 lg:p-12 rounded-3xl backdrop-blur-sm border border-studogrey/20 flex flex-col justify-center gap-6 bg-white/70 dark:bg-gray-800/70">
            <h3 className="text-2xl lg:text-3xl font-bold text-studodarkblue dark:text-white">
              {t("Ready for every challenge")}
            </h3>
            <p className="text-studodarkblue/80 dark:text-white/80 text-base lg:text-lg">
              {t("block3")}
            </p>
            <Link
              to="/register"
              className="mt-6 inline-block px-8 py-4 text-lg font-bold text-white bg-emerald-400 dark:bg-studoblue rounded-full border-2 border-emerald-400 dark:border-studoblue hover:bg-emerald-500 dark:hover:bg-studoblue/90 transition"
            >
              {t("Sign Up For Free")}
            </Link>
          </div>

          <div
            className="order-6 flex items-center justify-center rounded-3xl border-4 border-studogrey bg-emerald-400 p-8">
            <img src={ready} alt="Ready for challenge illustration" className="w-full max-w-sm object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}