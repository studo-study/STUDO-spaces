import { t } from "i18next";
import { Link } from "react-router-dom";
import hero from "../../../../public/assets/icons/start/create-vis.svg";

export default function AboutVisualsets() {
  return <div className={"w-full max-h-screen dark:text-white text-studodarkblue " +
    "min-h-[90vh] flex justify-center items-center " +
    "bg-gradient-to-b from-transparent via-transparent to-blue-900/40"}>
    <div className={"w-full h-full flex flex-row gap-15 justify-center items-center"}>
      <div className={"w-1/2 h-full flex flex-col items-end justify-center"}>
        <div className={"w-1/2 h-full gap-8 flex flex-col items-center justify-center"}>
          <span className={"w-full h-fit font-bold text-5xl"}>
            {t("Visual Learning, Identify by Identify")}</span>
          <span
            className={"w-full h-fit text-2xl font-bold"}>
            {t("A Visualset lets you study by linking definitions to pins on an image — perfect for anatomy, maps, and diagrams")}</span>
          <ul className={"w-full flex pl-5 gap-4 flex-col font-bold " +
            "text-base items-baseline justify-baseline mb-7"}>
            <li className={"list-disc"}>{t("Instead of just text terms, you upload an image")}</li>
            <li className={"list-disc"}>{t("Each identify on the image acts as the “term”")}</li>
            <li className={"list-disc"}>{t("To every identify, you attach the correct definition")}</li>
            <li className={"list-disc"}>{t("Use your Visualset in Identify or Point")}</li>
          </ul>
          <div className={"w-full flex items-center justify-baseline"}>
            <Link to={"/register"}
                  className={"px-6 py-3 rounded-full  flex items-center justify-center " +
                    "text-white bg-blue-500 font-bold"}>{t("create your own")}</Link>
          </div>
        </div>
      </div>
      <div className={"w-1/2 h-full flex flex-col justify-center overflow-hidden items-baseline"}>
        <img src={hero} alt="" className={"w-2/3"} />
      </div>
    </div>
  </div>;
}