import { PiStudent } from "react-icons/pi";
import Flashcard from "@/components/public/sets/studosets/flashcard";
import {Link, usePathname} from "@/i18n/routing";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";
import Image from "next/image";


interface viewProps {
    id: string;
}
export default async function StudosetView({ id }: viewProps) {
    const t = await getTranslations("studoset");
    const session = await auth();
    console.log(id);
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/studysets/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        }
    ).then(res => res.json());

    console.log(data);
    return (<>
                <div className="w-full h-fit flex flex-row items-center justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                    <span>{t("created")}</span>
                    <Link href={`/profile/` + data?.user_id} className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
                            gap-1.5 sm:gap-2 p-1.5 sm:p-2 pl-3 sm:pl-4 pr-3 sm:pr-5 bg-studodark max-w-fit
                            dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                            border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
                            dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                            dark:text-white min-w-0"
                    >
                        <div className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full flex-shrink-0">
                            {data?.img_url != 'default' ? <Image src={data.img_url} alt={'pfp'} width={0} height={0} className={'object-cover w-full'}/> : <PiStudent size={10} color={"white"} />}
                        </div>
                        <span className="opacity-50 text-xs sm:text-sm truncate hover:underline">@{data?.displayName}</span>
                    </Link>
                </div>
                <div className="w-full flex flex-col sm:flex-row mb-5 items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <span className="w-full sm:w-2/3 flex flex-row items-center justify-baseline text-2xl sm:text-3xl md:text-4xl font-semibold truncate">
                {data && data.title || t("set_title")}
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
                     text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a] font-semibold text-xs
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white px-4 sm:px-8 sm:text-base md:text-base">
                                <img src={"/icons/pencil.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("learn")}</span>
                            </div>
                        </Link>
                        <Link href={`/speedy/`} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                     text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a] font-semibold text-xs
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white px-4 sm:px-8 sm:text-base md:text-base">
                                <img src={"/icons/clock.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("speedy")}</span>
                            </div>
                        </Link>
                        <Link href={`/flashcards/`} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                     text-[#2a3a42] justify-center rounded-2xl bg-[#e7e7e747] cursor-pointer
                    dark:border-gray-700 dark:border-t-gray-500 dark:border-l-border-gray-500
                    border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
                    shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a] font-semibold text-xs
                    dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
                    dark:text-white px-4 sm:px-8 sm:text-base md:text-base">
                                <img src={"/icons/cards.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("flashcards")}</span>
                            </div>
                        </Link>
                    </div>

                    <Flashcard cards={data?.cards}/>
                    <hr className="w-full border-0.5 border-solid border-gray-500 mt-3 sm:mt-5 mb-1 sm:mb-2" />
                    <span className="w-full h-fit mb-2 sm:mb-3 font-bold text-sm sm:text-base">{t("progress_title")}:</span>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">

                    </div>

                    <hr className="w-full border-0.5 border-solid border-gray-500 mt-3 sm:mt-5 mb-3 sm:mb-5" />

                    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">

                    </div>
                </div>
        </>
    );
}
