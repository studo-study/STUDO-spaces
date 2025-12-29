import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeroBackground from "../../landing/pages/welcome/HeroBackground.jsx";
import Back from "../../../public/assets/icons/right.svg";
import Form from "./Form.jsx";
import DesktopForm from "./DesktopForm.jsx";
import {useEffect, useState} from "react";

export default function Login() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const CurrentYear = new Date().getFullYear();
  const navigate = useNavigate();
	useEffect(() => {
		setMounted(true);
	}, []);

  return (
	  <div className={"w-full h-full"}>
		  <div className="hidden md:flex relative min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
			  <div className="absolute inset-0 hidden dark:flex select-none pointer-events-none z-0">
				  <HeroBackground color="to-blue-400/10" />
			  </div>

			  <button
				  onClick={() => navigate(-1)}
				  className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50
          flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full
          bg-white dark:bg-gray-700 border-2 border-studogrey/30
          text-studodarkblue dark:text-white shadow-md hover:shadow-lg
          transition-all duration-200 active:scale-105 focus:outline-none
          focus:ring-2 focus:ring-studogrey/50"
				  aria-label="Go back">
				  <img
					  src={Back}
					  alt=""
					  className="w-5 sm:w-6 md:w-7 rotate-180 opacity-60 dark:invert"
				  />
			  </button>

			  <div className="relative h-screen w-screen p-10 pb-20 flex md:justify-center justify-center z-10">
				  {<div className={"flex md:hidden justify-center items-center"}><Form /></div>}
				  {<div className={"hidden md:flex justify-between items-center px-10 w-full"}>

					  <div className={`mt-16 flex items-end gap-6 h-full pb-5
								transition-all duration-700 delay-900
								${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
						  <div className="flex -space-x-3">
							  {[...Array(4)].map((_, i) => (
								  <div
									  key={i}
									  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800
												bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700"
								  />
							  ))}
						  </div>
						  <div className="text-sm text-studodarkblue/60 dark:text-white/60">
							  <span className="font-semibold text-studodarkblue dark:text-white">1,000+</span>
							  {" "}{t("students already studying")}</div>
					  </div>
					  <DesktopForm /></div>}
			  </div>

			  <div className="absolute bottom-0 left-0 right-0 z-50
        flex flex-col items-center justify-center sm:flex-row sm:justify-between
        gap-2 sm:gap-4 px-4 sm:px-6 md:px-12 lg:px-20 py-4 sm:py-5
        text-xs sm:text-sm text-studodarkblue/60 dark:text-white/60">

				  <p className="text-[10px] sm:text-xs opacity-75 order-1 sm:order-2">
					  {t("Version")} 2.02
				  </p>

				  <p className="text-center sm:text-right order-3 hidden sm:block">
					  &copy; {CurrentYear} {t("STUDO inc. All Rights Reserved.")}
				  </p>
			  </div>
		  </div>
	  </div>
  );
}