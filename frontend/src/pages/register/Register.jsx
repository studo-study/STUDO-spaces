import google from "../../../public/assets/icons/logos/google.svg";
import facebook from "../../../public/assets/icons/logos/facebook.svg";
import microsoft from "../../../public/assets/icons/logos/microsoft.svg";
import eyeClosed from "../../../public/assets/icons/eye-closed.svg";
import eyeOpened from "../../../public/assets/icons/eye-open.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroBackground from "../../landing/pages/welcome/HeroBackground.jsx";
import Back from "../../../public/assets/icons/right.svg";
import Form from "./Form.jsx";

export default function Register() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CurrentYear = new Date().getFullYear();

  const toggleShow = () => {
    setOpen(!open);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      <div className="absolute inset-0 hidden dark:flex select-none pointer-events-none z-0">
        <HeroBackground color="to-emerald-400/10" />
      </div>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50
          flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full
          bg-white dark:bg-gray-700 border-2 border-studogrey/30
          text-studodarkblue dark:text-white shadow-md hover:shadow-lg
          transition-all duration-200 active:scale-105 focus:outline-none
          focus:ring-2 focus:ring-studogrey/50"
        aria-label="Go back"
      >
        <img
          src={Back}
          alt=""
          className="w-5 sm:w-6 md:w-7 rotate-180 opacity-60 dark:invert"
        />
      </button>

      <div className="relative z-10 w-full max-w-md">
        <Form />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50
        flex flex-col items-center justify-center sm:flex-row sm:justify-between
        gap-2 sm:gap-4 px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-5
        text-xs sm:text-sm text-studodarkblue/60 dark:text-white/60">

        <p className="text-center sm:text-left order-2 sm:order-1">
          {t("Built with 💚 using React")}
        </p>

        <p className="text-[10px] sm:text-xs opacity-75 order-1 sm:order-2">
          {t("Version")} 2.01
        </p>

        <p className="text-center sm:text-right order-3 hidden sm:block">
          &copy; {CurrentYear} {t("STUDO inc. All Rights Reserved.")}
        </p>
      </div>
    </div>
  );
}