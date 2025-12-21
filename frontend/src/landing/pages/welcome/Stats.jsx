import { t } from "i18next";

export default function Stats() {
  return <div
    className={"w-full h-30 text-emerald-400 mb-15 dark:text-blue-400 flex flex-row items-center justify-center md:px-20"}>
    <div
      className={"md:w-1/3 px-10  w-full gap-3 flex flex-row border border-solid border-studogrey/20 border-1 " +
        "items-center justify-center rounded-3xl text-xs md:text-base backdrop-blur-md px-2 py-3"}>
      <span
        className={"min-w-fit h-full w-full text-center flex justify-center items-center"}>{t("5 study tools")}</span>
      <span className={"min-w-fit h-fit text-center flex justify-center items-center'}" +
        " px-3 border-r-1 border-l-1 border-solid border-emerald-400 dark:border-blue-400"}>
        {t("for students by students")}</span>
      <span
        className={"min-w-fit h-full text-center flex justify-center items-center"}>{t("100% free")}</span>
    </div>
  </div>;
}