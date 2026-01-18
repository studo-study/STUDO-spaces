import {useTranslations} from "next-intl";
import {FaCheck} from "react-icons/fa";
import Link from "next/link";
import {RiVerifiedBadgeFill} from "react-icons/ri";

const free = [
    { feature: "Create basic Studosets" },
    { feature: "Access free Studosets" },
    { feature: "Study with ads" },
    { feature: "Online use only" }
]

const select = [
    { feature: "Access premium Studosets" },
    { feature: "Create study timelines" },
    { feature: "Print study sets for offline use" },
    { feature: "Deep study analytics" },
    { feature: "Ad-free studying" },
    { feature: "Unlimited access to all features" }
]

export default function SelectPage() {
    const t = useTranslations("select")
    return (
        <div className="w-full h-full py-15 bg-radial from-blue-500/10 via-transparent to-transparent flex flex-col items-center gap-10 scroll-hidden">
                <div className={"w-full h-fit flex flex-col gap-5 items-center justify-center"}>
                    <span className={"font-sfpro dark:text-studoblue text-studodarkblue text-sm font-bold"}>{t("pricing")}</span>
                    <h1 className={"font-sfpro gap-3 justify-center items-center dark:text-white flex text-studodarkblue  font-bold"}>
                        <span className={"font-akira text-5xl truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent "}>STUDO</span>
                        <span className={"text-3xl h-fit bg-clip-text text-transparent truncate bg-linear-to-r from-indigo-300 to-blue-300"}>select</span>
                    </h1>
                </div>

                <span className={"w-2/3 h-fit dark:text-white/30 text-center text-xl font-semibold text-studodarkblue "}>{t("plan")}</span>
                <div className={"w-full h-full flex flex-row gap-10 justify-center items-baseline pt-20"}>
                    <div className={`w-1/3 hover:scale-102 transition-all duration-300 border shadow-2xl bg-studogrey/10 rounded-3xl
                        border-studoborder/30 h-130 p-10 flex flex-col items-baseline gap-8`}>
                        <span className={"dark:text-emerald-500 font-semibold"}>{t("free")}</span>
                        <h2 className={"text-3xl text-white font-bold h-fit "}>Free</h2>
                        <p className={"text-white/50 text-lg h-10"}>{t("free_expl")}</p>
                        <div className={"w-ful h-60 flex flex-col gap-5"}>
                            {free.map((item, i) => (
                                <span key={i} className={"w-full flex items-center gap-3 dark:text-white font-bold"}>
                                <FaCheck className={"text-emerald-500"} />
                                    {item.feature}
                            </span>
                            ))}
                        </div>
                        <div className="w-full text-center py-3 rounded-4xl bg-emerald-500/10 text-white font-bold border border-studoborder">{t("current")}</div>

                    </div>

                    <div className={`w-2/5 cursor-pointer hover:scale-102 transition-all duration-300 border shadow-2xl bg-linear-to-br from-gray-300/10 via-white/10 to-gray-400/10 rounded-3xl
                        border-blue-500 h-150 p-10 flex flex-col items-baseline gap-8`}>
                        <span className={"dark:text-blue-500 font-semibold flex gap-2 items-center"}><RiVerifiedBadgeFill />{t("select")}</span>
                        <div className={"w-full flex gap-2 flex-row items-center dark:text-white"}>
                            <h2 className={"text-3xl font-bold h-fit "}>€3.99</h2>
                            <span className={"text-white/30 font-bold text-xs"}>{t("month")}</span>
                        </div>
                        <p className={"text-white/50 text-lg h-10"}>{t("select_expl")}</p>
                        <div className={"w-ful h-60 flex flex-col gap-5"}>
                            {select.map((item, i) => (
                                <span key={i} className={"w-full flex items-center gap-3 dark:text-white font-bold"}>
                                <FaCheck className={"text-studoblue"} />
                                    {item.feature}
                            </span>
                            ))}
                        </div>
                        <Link className="w-full text-center py-3 rounded-4xl bg-blue-500 text-white font-bold border border-studoborder" href={"/pay"}>{t("start_tdy")}</Link>
                    </div>

                </div>

        </div>
    );
}