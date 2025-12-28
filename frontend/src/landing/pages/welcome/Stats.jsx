import { t } from "i18next";
import {FiTool} from "react-icons/fi";
import {PiStudent} from "react-icons/pi";
import {TbFreeRights} from "react-icons/tb";
import {IoIosInfinite} from "react-icons/io";

export default function Stats() {
  return <div
    className={"w-full h-30 text-emerald-400 mb-15 dark:text-blue-400 flex flex-row items-center justify-center md:px-20"}>
    <div
      className={`md:w-2/5  w-full gap-3 flex flex-row border border-solid border-studogrey/20 border-1
        items-center justify-center rounded-full text-xs md:text-base backdrop-blur-md py-3`}>
      <span
        className={"w-3/4 h-full text-center gap-2 flex flex-col  justify-center items-center"}>
		  		  <FiTool />
		 <span>{t("5 study tools")}</span>
	  </span>
      <span className={"w-full h-fit flex flex-col justify-center items-center gap-2 px-3 border-r-1 border-l-1 border-solid border-emerald-400 dark:border-blue-400"}>
 			<IoIosInfinite />
        <span>{t("endless sets")}</span>
	  </span>
      <span
        className={"w-3/4 h-full text-center flex flex-col justify-center items-center gap-2"}>
		   <TbFreeRights />
		  <span>{t("100% free")}</span>

	  </span>
    </div>
  </div>;
}