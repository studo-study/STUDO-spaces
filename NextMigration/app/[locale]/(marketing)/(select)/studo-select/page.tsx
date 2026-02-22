import {useTranslations} from "next-intl";
import {FaCheck} from "react-icons/fa";
import Link from "next/link";
import {RiVerifiedBadgeFill} from "react-icons/ri";
import AnimateOnMount from "@/components/overige/ui/AnimateOnMount";

const free = [
    { feature: "Create basic Studosets" },
    { feature: "Access to core features" },
    { feature: "Study with ads" },
    { feature: "Online use only" }
]

const select = [
    { feature: "AI-powered set generation" },
    { feature: "PDF & Word to Studoset" },
    { feature: "Course linking" },
    { feature: "Semantic search" },
    { feature: "8GB upload & 100 credits" },
]

export default function SelectPage() {
    const t = useTranslations("select")
    return (
        <div className="w-full h-fit pt-25 bg-radial from-blue-500/10 via-transparent to-transparent flex flex-col items-center gap-10 scroll-hidden">
            <div className={"w-full min-h-screen flex items-center flex-col gap-10"}>
                <div className={"w-full h-fit flex flex-col gap-5 items-center justify-center"}>
                    <AnimateOnMount delay={100}>
                        <span className={"font-sfpro dark:text-studoblue text-studodarkblue text-sm font-bold"}>{t("pricing")}</span>
                    </AnimateOnMount>

                    <AnimateOnMount delay={200}>
                        <h1 className={"font-sfpro gap-3 justify-center items-center dark:text-white flex text-studodarkblue  font-bold"}>
                            <span className={"font-akira text-5xl truncate bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent "}>STUDO</span>
                            <span className={"text-3xl h-fit bg-clip-text text-transparent truncate bg-linear-to-r from-indigo-300 to-blue-300"}>select</span>
                        </h1>
                    </AnimateOnMount>
                </div>

                <AnimateOnMount delay={300} className={"w-1/2 h-fit text-center"}>
                    <span className={"text-center dark:text-white/30 text-xl font-semibold text-studodarkblue "}>{t("plan")}</span>
                </AnimateOnMount>
                <AnimateOnMount delay={400} className={"w-2/3 h-fit text-center mb-20"}>
                    <div className={"w-full h-full flex lg:flex-row flex-col gap-10 justify-center items-baseline pt-20"}>
                        <div className={`lg:w-1/3 w-full hover:scale-102 transition-all duration-300 border shadow-2xl bg-studogrey/10 backdrop-blur-2xl rounded-3xl
                        border-studoborder/30 h-130 p-10 flex flex-col items-baseline gap-8`}>
                            <span className={"dark:text-emerald-500 font-semibold"}>{t("free")}</span>
                            <h2 className={"text-3xl text-white font-bold h-fit "}>Free</h2>
                            <p className={"text-white/50 text-lg h-10"}>{t("free_expl")}</p>
                            <div className={"w-full h-60 flex flex-col gap-5"}>
                                {free.map((item, i) => (
                                    <span key={i} className={"w-full flex items-center gap-3 dark:text-white font-bold"}>
                                <FaCheck className={"text-emerald-500"} />
                                        {item.feature}
                            </span>
                                ))}
                            </div>
                            <div className="w-full text-center py-3 rounded-4xl bg-emerald-500/10 text-white font-bold border border-studoborder">{t("current")}</div>

                        </div>

                        <div className={`relative w-full lg:w-2/5 cursor-pointer hover:scale-102 transition-all duration-300 border shadow-2xl bg-linear-to-br from-gray-300/10 via-white/10 to-gray-400/10 backdrop-blur-2xl rounded-3xl
                        border-blue-500 min-h-150 p-10 flex flex-col items-baseline gap-8`}>
                            <span className={"dark:text-blue-500 font-semibold flex gap-2 items-center"}><RiVerifiedBadgeFill />{t("select")}</span>
                            <div className={"w-full flex gap-2 flex-row items-center dark:text-white"}>
                                <h2 className={"text-3xl font-bold h-fit "}>€5.99</h2>
                                <span className={"text-white/30 font-bold text-xs"}>{t("month")}</span>
                            </div>
                            <p className={"text-white/50 text-lg h-10"}>{t("select_expl")}</p>
                            <div className={"w-full h-60 flex flex-col gap-5"}>
                                {select.map((item, i) => (
                                    <span key={i} className={"w-full flex items-center gap-3 dark:text-white font-bold"}>
                                <FaCheck className={"text-studoblue"} />
                                        {item.feature}
                            </span>
                                ))}
                            </div>
                            <div className="w-full text-center py-3 rounded-4xl bg-blue-500 text-white font-bold border border-studoborder" >{t("start_tdy")}</div>
                            <span className="absolute z-30 bg-blue-500 px-3 py-1 text-xs font-bold text-white rounded-full -top-2 left-1/2 -translate-x-1/2 -translate-y-1/2">{t("popular")}</span>
                        </div>

                    </div>
                </AnimateOnMount>

                <AnimateOnMount delay={500} className={"w-full h-fit flex items-center justify-center mb-20"}>
                <div className={"w-1/2 xl:h-35 text-white mb-10 px-10 3xl:px-25 flex p-5 xl:flex-row flex-col h-fit items-center xl:justify-between justify-center gap-5 rounded-full bg-studogrey/30 shadow-2xl border border-studoborder"}>
                    <div className={"w-full h-full flex items-center text-center xl:text-left 3xl:px-10 "}>
                        <div className={"w-full flex flex-col gap-3"}>
                            <span className={"font-bold sm:text-lg 3xl:text-2xl text-base"}>{t("group")}</span>
                            <span className={"text-base 3xl:text-xl opacity-50"}>{t("korting_school")}</span>
                        </div>
                    </div>
                    <div className={"3xl:w-1/3 w-fit h-full px-10 flex items-center justify-end"}>
                        <Link href={"/studo-for-education"} className={"px-5 py-3 truncate font-bold rounded-4xl bg-blue-500 border border-studoborder"}>{t("try_edu")}</Link>
                    </div>
                </div>
                </AnimateOnMount>
            </div>
            <div></div>
        </div>
    );
}