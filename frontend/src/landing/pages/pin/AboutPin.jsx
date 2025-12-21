import { t } from "i18next";
import { Link } from "react-router-dom";
import hero from "../../../../public/assets/icons/start/point.svg";

export default function AboutPin() {
  return <div className={"w-full max-h-screen min-h-[90vh] flex dark:text-white text-studodarkblue " +
    "justify-center items-center " +
    "bg-gradient-to-b from-transparent via-transparent to-rose-700/40"}>
    <div className={"w-full h-full flex flex-row gap-15 justify-center items-center"}>
      <div className={"w-1/2 h-full flex flex-col items-end justify-center"}>
        <div className={"w-1/2 h-full gap-8 flex flex-col items-center justify-center"}>
          <span className={"w-full h-fit font-bold text-5xl"}>
            {t("Identify the parts,\n Learn the \n whole")}</span>
          <span
            className={"w-full h-fit text-2xl font-bold"}>
            {t("Identify by typing the correct terms for each identify—perfect for anatomy, " +
              "maps, diagrams, and more")}</span>
          <ul className={"w-full flex pl-5 gap-4 flex-col font-bold " +
            "text-base items-baseline justify-baseline mb-7"}>
            <li className={"list-disc"}>{t("Step through pins one by one")}</li>
            <li className={"list-disc"}>{t("Type the matching definition")}</li>
            <li className={"list-disc"}>{t("Missed pins return later until mastered")}</li>
            <li className={"list-disc"}>{t("Only possible with visualsets")}</li>
          </ul>
          <div className={"w-full flex items-center justify-baseline"}>
            <Link to={"/register"}
                  className={"px-6 py-3 rounded-full  flex items-center justify-center " +
                    "text-white bg-rose-400 font-bold"}>{t("try it out")}</Link>
          </div>
        </div>
      </div>
      <div className={"w-1/2 h-full flex flex-col justify-center items-baseline"}>
        <img src={hero} alt="" className={"md:min-w-150 w-1/2"} />
      </div>
    </div>
  </div>;
}