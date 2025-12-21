import { t } from "i18next";
import { Link } from "react-router-dom";
import hero from "../../../../public/assets/icons/start/pinpin.svg";

export default function AboutPoint() {
  return <div
    className={"w-full dark:text-white text-studodarkblue max-h-screen min-h-[90vh] flex justify-center items-center " +
      "bg-gradient-to-b from-transparent via-transparent to-purple-700/40"}>
    <div className={"w-full h-full flex flex-row gap-15 justify-center items-center"}>
      <div className={"w-1/2 h-full flex flex-col items-end justify-center"}>
        <div className={"w-1/2 h-full gap-8 flex flex-col items-center justify-center"}>
          <span className={"w-full h-fit font-bold text-5xl "}>
            {t("Read - \n Point - \n Remember")}</span>
          <span
            className={"w-full h-fit text-2xl font-bold"}>
            {t("Select the correct identify on the image based on the given definition")}</span>
          <ul className={"w-full flex pl-5 gap-4 flex-col font-bold " +
            "text-base items-baseline justify-baseline mb-7"}>
            <li className={"list-disc"}>{t("Get a definition as your prompt")}</li>
            <li className={"list-disc"}>{t("Identify the right spot on the image")}</li>
            <li className={"list-disc"}>{t("Wrong choices come back until learned")}</li>
            <li className={"list-disc"}>{t("Only possible with visualsets")}</li>
          </ul>
          <div className={"w-full flex items-center justify-baseline"}>
            <Link to={"/register"}
                  className={"px-6 py-3 rounded-full  flex items-center justify-center " +
                    "text-white bg-purple-400 font-bold"}>{t("try it out")}</Link>
          </div>
        </div>
      </div>
      <div className={"w-1/2 h-full flex flex-col justify-center items-baseline"}>
        <img src={hero} alt="" className={"md:min-w-150 w-1/2"} />
      </div>
    </div>
  </div>;
}