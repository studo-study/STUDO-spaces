import { t } from "i18next";
import ClassActive from "./ClassActive.jsx";

export default function Classmates({ classMates }) {
  return (
    <div className="w-full mt-3 sm:mt-4 md:mt-7">
      <div className="flex justify-around items-baseline flex-col
        bg-studowhite min-h-32 sm:min-h-36 md:min-h-40 max-h-fit w-full gap-2
        border-1 border-transparent border-studoborder rounded-2xl sm:rounded-4xl
        shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] p-3 backdrop-blur-xs
        dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
        mb-6 sm:mb-8 md:mb-10
        border-[0.5px] border-solid
        dark:border-t-gray-500 dark:border-l-gray-500 grid-flow-col
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
        grid grid-cols-1 sm:grid-cols-2 auto-rows-min">
        {classMates.length === 0 ? (
          <span className="w-full h-full col-span-full justify-center items-center flex text-sm sm:text-base">
            {t("no activity")}
          </span>
        ) : (
          classMates.map((classMate, index) => (
            <ClassActive classMate={classMate} key={index} />
          ))
        )}
      </div>
    </div>
  );
}