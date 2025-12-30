import IG from "../../../assets/icons/socialmedia/instagram-svgrepo-com.svg";
import TT from "../../../assets/icons/socialmedia/tiktok-svgrepo-com.svg";
import { FaYoutube } from "react-icons/fa6";
import LI from "../../../assets/icons/socialmedia/linkedin-svgrepo-com.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function LandingFooter() {
  const { t } = useTranslation();
  const CurrentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex flex-col text-white">
      <div className="w-full flex items-center justify-center py-8 bg-white dark:bg-[#182536]">
        <span className="font-bold text-2xl text-emerald-400 dark:text-white">
          {t("Study Smart, Stay Ahead!")}
        </span>
      </div>

      <div className="w-full py-10 bg-emerald-400 dark:bg-[#182536] flex flex-col items-center">
        <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2 flex flex-col gap-8">
              <span className="font-bold font-akira text-4xl lg:text-5xl text-white">STUDO</span>
              <div className="flex flex-row gap-5 items-center">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src={IG} alt="Instagram" className="h-10 invert" />
                </a>
                <a href="https://www.tiktok.com/@studo.study" target="_blank" rel="noopener noreferrer">
                  <img src={TT} alt="TikTok" className="h-7 invert" />
                </a>
                <a href="https://www.youtube.com/@STUDO-app" target="_blank" rel="noopener noreferrer">
                  <FaYoutube size={30} />
                </a>
                <a href="https://www.linkedin.com/in/studo-app-67a487381/" target="_blank" rel="noopener noreferrer">
                  <img src={LI} alt="LinkedIn" className="h-10 invert" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-bold text-xl">{t("ABOUT STUDO")}</span>
              <Link to="/about-us" className="hover:underline">{t("About Us")}</Link>
              <Link to="/privacy" className="hover:underline">{t("Privacy")}</Link>
              <Link to="/terms-of-service" className="hover:underline">{t("Terms of Service")}</Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-bold text-xl">{t("STUDYSETS")}</span>
              <Link to="/login" className="hover:underline">{t("Create Studyset")}</Link>
              <Link to="/login" className="hover:underline">{t("Studysets")}</Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-bold text-xl">{t("VISUALSETS")}</span>
              <Link to="/login" className="hover:underline">{t("Create Visualset")}</Link>
              <Link to="/login" className="hover:underline">{t("Visualsets")}</Link>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-base px-6 sm:px-0">
            <p className="dark:hidden text-center sm:text-left">
              {t("Built with 💚 using React")}
            </p>
            <p className="hidden dark:flex text-center sm:text-left">
              {t("Built with 💙 using React")}
            </p>
            <p className="text-xs opacity-75 order-first sm:order-none">
              {t("Version")} 2.02
            </p>
            <p className="text-center sm:text-right">
              &copy; {CurrentYear} {t("STUDO inc. All Rights Reserved.")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}