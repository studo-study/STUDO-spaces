import { PiStudent } from "react-icons/pi";
import {useTranslations} from "next-intl";
import Flashcard from "@/components/public/sets/studosets/flashcard";
import {Link} from "@/i18n/routing";
import {FaRegBookmark} from "react-icons/fa";
import {SiGoogleclassroom} from "react-icons/si";
import {IoIosSettings, IoIosShareAlt} from "react-icons/io";


export default function StudosetView() {
    const t = useTranslations("studoset");
    return (
        <div className="w-screen mt-10 dark:text-white md:mt-0 min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
            <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-w-[700px] flex-col items-center justify-center gap-3 sm:gap-5">
                <div className="w-full h-fit flex flex-row items-center justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                    <span>{t("created")}</span>
                    <Link href={`/profile/`} className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
                            gap-1.5 sm:gap-2 p-1.5 sm:p-2 pl-3 sm:pl-4 pr-3 sm:pr-5 bg-studodark max-w-fit
                            dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                            border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                            dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                            dark:text-white min-w-0"
                    >
                        <div className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full flex-shrink-0">
                            <PiStudent size={10} color={"white"} />
                        </div>
                        <span className="opacity-50 text-xs sm:text-sm truncate hover:underline">@{"naam"}</span>
                    </Link>
                </div>
                <div className="w-full flex flex-col sm:flex-row mb-5 items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <span className="w-full sm:w-2/3 flex flex-row items-center justify-baseline text-2xl sm:text-3xl md:text-4xl font-semibold truncate">
                {t("set_title")}
              </span>
                    <div className="w-full sm:w-1/3 flex h-full gap-2 sm:gap-3 flex-row items-center justify-start sm:justify-end flex-wrap">

                        <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                    font-atrament font-normal text-[#2a3a42] justify-center
                    rounded-full bg-[#e7e7e747] cursor-pointer select-none
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white"
                        >
                            <img src={"/icons/save.svg"}  className="h-4 sm:h-5 dark:invert dark:brightness-0" />
                        </div>


                        <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                  font-normal text-[#2a3a42] justify-center rounded-full bg-[#e7e7e747] cursor-pointer
                  dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                  border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                  shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                  dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                  dark:text-white" >
                            <img src={"/icons/classroom.svg"}  className="h-4 sm:h-5 dark:invert dark:brightness-0" />
                        </div>

                        <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                  font-atrament font-normal text-[#2a3a42] justify-center rounded-full bg-[#e7e7e747] cursor-pointer
                  dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                  border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                  shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                  dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                  dark:text-white">
                            <img src={"/icons/share.svg"}  className="h-4 sm:h-5 dark:invert dark:brightness-0" />
                        </div>

                        <div className="inline-flex flex-row items-center gap-[0.6em] min-h-9 min-w-9 sm:min-h-10 sm:min-w-10
                  font-atrament font-normal text-[#2a3a42] justify-center rounded-full bg-[#e7e7e747] cursor-pointer
                  dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                  border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                  shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                  dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                  dark:text-white">
                            <img src={"/icons/settings.svg"}  className="h-4 sm:h-5 dark:invert dark:brightness-0" />
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center items-center">
                    <div className="w-full grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-3">
                        <Link href={`/learn/`} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                    font-normal text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white px-4 sm:px-8 font-atrament text-base sm:text-lg md:text-xl">
                                <img src={"/icons/pencil.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("learn").toUpperCase()}</span>
                            </div>
                        </Link>
                        <Link href={`/speedy/`} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                    font-normal text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white px-4 sm:px-8 font-atrament text-base sm:text-lg md:text-xl">
                                <img src={"/icons/clock.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("speedy").toUpperCase()}</span>
                            </div>
                        </Link>
                        <Link href={`/flashcards/`} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                    font-normal text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white px-4 sm:px-8 font-atrament text-base sm:text-lg md:text-xl">
                                <img src={"/icons/cards.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("flashcards").toUpperCase()}</span>
                            </div>
                        </Link>
                    </div>

                    <Flashcard />
                    <hr className="w-full border-0.5 border-solid border-gray-500 mt-3 sm:mt-5 mb-1 sm:mb-2" />
                    <span className="w-full h-fit mb-2 sm:mb-3 font-bold text-sm sm:text-base">{t("Your Progress:")}</span>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">

                    </div>

                    <hr className="w-full border-0.5 border-solid border-gray-500 mt-3 sm:mt-5 mb-3 sm:mb-5" />

                    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">

                    </div>
                </div>
            </div>
        </div>
    );
}
