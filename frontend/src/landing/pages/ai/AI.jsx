// AI.jsx
import { t } from "i18next";
import { useEffect, useState } from "react";
import hero from "../../../../public/assets/icons/start/ai.svg";

export default function AI() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return <div className={`
    w-full dark:text-white text-studodarkblue ` +
		' max-h-screen min-h-[90vh] pt-25 p-10 md:p-20 xl:p-0 xl:pt-0 h-screen flex justify-center items-center ' +
		'bg-gradient-to-b from-transparent via-pink-400/20 to-purple-400/40'}>
		<div className={'w-full h-full flex flex-col xl:flex-row gap-15 justify-center items-center'}>
			<div className={'w-full xl:w-1/2 h-full flex flex-col items-end justify-center'}>
				<div className={'w-full xl:w-1/2 h-full gap-8 flex flex-col items-center justify-center'}>
          <span className={`w-full h-fit font-bold text-5xl 
            transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} `}>
            {t("AI That Builds Your Sets")}</span>
					<span
						className={`w-full h-fit text-2xl font-bold text-pink-600 dark:text-pink-400
            transition-all duration-700 delay-200
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} `}>
            {t("* coming soon")}</span>
					<ul className={`w-full flex pl-5 gap-4 flex-col font-bold 
          transition-all duration-700 delay-300
       ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} 
                   text-base items-baseline justify-baseline mb-7`}>
						<li className={"list-disc"}>{t("Upload a vocabulary list, glossary, or lecture notes and turn them into a studyset")}</li>
						<li className={"list-disc"}>{t("Snap a photo of a textbook page or diagram and let AI detect the terms")}</li>
						<li className={"list-disc"}>{t("AI cleans up the data into ready-to-use pairs")}</li>
						<li className={"list-disc"}>{t("Generated sets work across all modes")}</li>
					</ul>
				</div>
			</div>
			<div className={`hidden xl:flex xl:w-1/2 h-full flex-col justify-center overflow-hidden items-baseline
      transition-all duration-700 delay-400 ${mounted ? "opacity-100" : "opacity-0"} `}>
				<img src={hero} alt="" className={"w-2/3"} />
			</div>
		</div>
	</div>;
}