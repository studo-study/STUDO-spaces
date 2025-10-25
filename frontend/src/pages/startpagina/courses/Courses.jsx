import {useTranslation} from "react-i18next";

export default function Courses() {
	//variables
	const { t, i18n } = useTranslation();

	return <div className="flex justify-around items-baseline
			  bg-studowhite min-h-85 w-full gap-5 border-1 border-transparent border-studoborder rounded-4xl
			  shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-10 pl-7 pr-7 backdrop-blur-xs
			dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a] mb-10
			  border-[0.5px] border-solid
  dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
			  <div className="w-full flex flex-row justify-baseline text-studodarkblue dark:text-white">
				  <span className="text-xl select-none"> {t("Recently")}: </span>
			  </div>
	  		<div className="">
			</div>
  		</div>;
}