import { t } from "i18next";
import Navbar from "./navbar/Navbar.jsx";

export default function Studysets() {
  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div
        className="flex w-full mt-10 md:mt-0 sm:w-11/12 md:w-4/5 lg:w-3/5 flex-col items-center justify-center gap-3">
        <span className="w-full text-2xl sm:text-3xl md:text-4xl flex flex-col justify-center items-baseline
          text-studodarkblue font-atrament font-semibold dark:text-white">
          {t("YOUR FILES")}
        </span>
        <Navbar />
      </div>
    </div>
  );
}