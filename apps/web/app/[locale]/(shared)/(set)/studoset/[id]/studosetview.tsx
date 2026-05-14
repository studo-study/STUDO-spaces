import { PiStudent } from "react-icons/pi";
import Flashcard from "@/components/ui/public/sets/studosets/flashcard";
import {Link} from "@/i18n/routing";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";
import Image from "next/image";
import {Card} from "@/types/types";
import CardItem from "@/components/ui/public/sets/studosets/carditem";
import {Progress} from "@/components/ui/marketing/progress/progress";
import {IoFilter, IoFolderOpenOutline} from "react-icons/io5";
import {FaRegHeart} from "react-icons/fa";
import SavedPopup from "@/components/ui/public/sets/studosets/savedpopup";
import ClassroomPopup from "@/components/ui/public/sets/studosets/classroompopup";
import SharePopup from "@/components/ui/public/sets/studosets/sharepopup";
import SettingsPopup from "@/components/ui/public/sets/studosets/settingspopup";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";


interface viewProps {
    id: string;
}
export default async function StudosetView({ id }: viewProps) {
    const t = await getTranslations("studoset");
    const session = await auth();
    const token = session?.accessToken;
    const data = await fetch(
        `${process.env.AUTH_API_URL}/studysets/${id}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
        }
    ).then(res => res.json());

    const not_studied = data?.session?.cards?.reduce((sum: number, card: any) => {
        return card.card_viewcount === 0 ? sum + 1 : sum;
    }, 0) ?? 0;

    const reviewed = data?.session?.cards?.reduce((sum: number, card: any) => {
        return card.card_viewcount === 1 ? sum + 1 : sum;
    }, 0) ?? 0;

    const studied = data?.session?.cards?.reduce((sum: number, card: any) => {
        return card.card_viewcount > 1 ? sum + 1 : sum;
    }, 0) ?? 0;

    console.log(data)

    return (<>
                <div className="w-full h-fit flex flex-row items-center justify-baseline gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                    <span>{t("created")}</span>
                    <Link href={`/profile/` + data?.user_id} className="flex flex-row w-fit h-fit rounded-full sm:rounded-4xl
                            gap-1.5 sm:gap-2 p-1.5 sm:p-2 pl-3 sm:pl-4 pr-3 sm:pr-5 l max-w-fit
                             bg-studogrey/30 border border-studoborder/30 shadow-2x
                            dark:text-white min-w-0"
                    >
                        <div className="min-h-4 max-h-4 min-w-4 justify-center items-center flex max-w-4 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5 bg-emerald-400 overflow-hidden rounded-full flex-shrink-0">
                            {data?.img_url != 'default' ? <Image src={data?.img_url} alt={'pfp'} width={0} height={0} className={'object-cover w-full'}/> : <PiStudent size={10} color={"white"} />}
                        </div>
                        <span className="opacity-50 text-xs sm:text-sm truncate hover:underline">@{data?.displayName}</span>
                    </Link>
                </div>
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <span className="w-full sm:w-2/3 flex flex-row items-center justify-baseline text-2xl sm:text-3xl md:text-4xl font-semibold truncate">
                {data && data.title || t("set_title")}
              </span>
                    <div className="w-full sm:w-1/3 flex h-full gap-2 sm:gap-3 flex-row items-center justify-start sm:justify-end flex-wrap">

                        <SavedPopup/>
                        <ClassroomPopup/>
                        <SharePopup/>
                        <SettingsPopup/>
                    </div>
                </div>
                <div className={"w-full h-20 flex flex-col gap-2 opacity-40"}>
                    <div className={"w-full flex flex-row gap-2 items-center"}>
                        <IoFolderOpenOutline />
                        <span>{t("saved_in")}: {data?.folders?.[0]?.name}</span>
                    </div>
                    {data?.classrooms?.[0] && <div className={"w-full flex flex-row gap-2 items-center"}>
                       <Image src={"/icons/classroom.svg"} alt={"studeerhoed"} width={17} height={0} className="min-h-4 h-5 sm:min-h-5 dark:invert dark:brightness-0"/>
                        <span>{t("added_to")}: {data?.classrooms[0]?.name}</span>
                    </div>}
                    <div className={"w-full flex flex-row gap-2 items-center"}>
                        <FaRegHeart />
                        <span>{data?.likes?.length} {data?.likes?.length != 1 ? t("likes") : t("like")}</span>
                    </div>
                </div>
                <div className="w-full h-fit flex flex-col gap-6 sm:gap-8 md:gap-10 justify-center items-center">
                    <div className="w-full grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-3">
                        <Link href={`/learn/` + id} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                     text-studodarkblue justify-center rounded-full cursor-pointer bg-studogrey/30 uppercase
                     shadow-2xl border border-studoborder/30 font-semibold text-xs dark:text-white px-4 sm:px-8 sm:text-base md:text-base">
                                <img src={"/icons/pencil.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("learn")}</span>
                            </div>
                        </Link>
                        <Link href={`/speedy/`+ id} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                     text-studodarkblue justify-center rounded-full cursor-pointer bg-studogrey/30 uppercase
                     shadow-2xl border border-studoborder/30 font-semibold text-xs dark:text-white px-4 sm:px-8 sm:text-base md:text-base">
                                <img src={"/icons/clock.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("speedy")}</span>
                            </div>
                        </Link>
                        <Link href={`/flashcards/` + id} className="w-full">
                            <div className="inline-flex flex-row items-center gap-2 sm:gap-3 min-h-10 sm:min-h-12 w-full
                     text-studodarkblue justify-center rounded-full cursor-pointer bg-studogrey/30 uppercase
                     shadow-2xl border border-studoborder/30 font-semibold text-xs dark:text-white px-4 sm:px-8 sm:text-base md:text-base">
                                <img src={"/icons/cards.svg"} alt="" className="h-4 sm:h-5 dark:invert dark:brightness-0 flex-shrink-0" />
                                <span className="truncate">{t("flashcards")}</span>
                            </div>
                        </Link>
                    </div>

                    <Flashcard id={id} cards={data?.cards}/>

                    <hr className="w-full border-0.5 border-solid border-studoborder/30" />
                    <span className="w-full h-fit font-bold text-sm sm:text-base">{t("progress_title")}:</span>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                        <div className={"w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"}>
                            <span className={"font-bold"}>{t("not_learned")}</span>
                            <Progress length={data?.cards?.length} progress={not_studied}/>
                        </div>
                        <div className={"w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"}>
                            <span className={"font-bold"}>{t("reviewed")}</span>
                            <Progress length={data?.cards?.length} progress={reviewed}/>
                        </div>
                        <div className={"w-full h-full p-5 border border-studoborder/30 rounded-3xl bg-studogrey/30 flex flex-col items-center justify-center gap-2"}>
                            <span className={"font-bold"}>{t("studied")}</span>
                            <Progress length={data?.cards?.length} progress={studied}/>
                        </div>
                    </div>

                    <hr className="w-full border-0.5 border-solid border-studoborder/30" />
                    <div className={"w-full flex justify-between items-center"}>
                        <span className="w-full h-fit font-bold text-sm sm:text-base">{t("cards_title")}:</span>
                        <button className={"w-8 h-8 bg-studogrey/30 border-studoborder/30 border rounded-full items-center justify-center flex cursor-pointer"}>
                            <IoFilter />
                        </button>
                    </div>
                    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
                        {data?.cards?.map((card: Card, i: number) =>  <CardItem key={i} index={i} card={card}/>)}
                    </div>
                    <div className="w-full h-fit flex flex-col gap-3 sm:gap-4 md:gap-5">
                        <Link href={"/studoset/" + id + "/edit"} className={'w-full h-14 rounded-full flex items-center justify-center dark:bg-studoblue cursor-pointer bg-emerald-400 text-white font-bold border-studoborder border'} >{t("edit")}</Link>
                    </div>
                    <BottomCredits/>
                </div>
        </>
    );
}
