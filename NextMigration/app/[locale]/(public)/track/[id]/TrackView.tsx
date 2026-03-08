"use client"
import Image from "next/image";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {ProfileResponseDto} from "@/types/types";
import {useTranslations} from "next-intl";


export default function TrackView() {
    const t = useTranslations("trackview");
    const param = useParams();
    const [result, setResult] = useState<ProfileResponseDto>()  // [] ipv null, anders crasht .map()
    const [activePage, setActivePage] = useState("tracks");

    const toggleActivePage = (type: string) => {
        switch (type) {
            case "tracks": setActivePage("tracks"); break;
            case "sets": setActivePage("sets"); break;
            case "communities": setActivePage("communities"); break;
        }
    }
    useEffect(() => {
        if (!param.id) return
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profiles/public/${param.id}`)
            .then(r => r.json())
            .then((data) => {
                setResult(data)  // niet data.json(), al geparsed
            })
    }, [param.id])


    if (!result) return null;
    console.log(result);

    return (<div className="w-screen mt-10 dark:text-white md:mt-0 min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
        <div className="flex h-screen w-full sm:w-11/12 md:w-4/5 max-w-[900px] flex-col items-center gap-3 sm:gap-5">
            <div className={"w-full pointer-events-none min-h-1/4 max-h-1/4 relative overflow-hidden rounded-4xl"}>
                    <div className={"relative min-w-full rounded-4xl overflow-hidden bg-studoblue h-full"}>
                        {result && result?.profile && result?.profile.banner_url && (
                            <Image
                                src={result.profile.banner_url}
                                alt="banner"
                                fill
                                className="object-cover rounded-3xl"
                            />
                        )}
                    </div>
                <div className={"absolute bottom-0 z-30 w-full h-25 bg-linear-0 dark:from-gray-800 dark:via-gray-700 from-gray-200 via-gray-50/50 to-transparent"}></div>
                <div className={"absolute bottom-0 z-40 w-1/2 h-25 flex items-center p-5 gap-2"}>
                    <div className={"rounded-full border border-studoborder overflow-hidden w-20 h-20"}>
                        <Image
                            src="/icons/icon2.png"
                            alt="logo"
                            width={100}
                            height={100}
                            className="w-20 h-20 object-cover"
                        />
                    </div>
                    <div className={"w-fit backdrop-blur-2xl rounded-full px-3 flex items-center justify-center gap-2"}>
                        <span className={"text-xl truncate text-gray-500"}><span className={"font-bold text-studodarkblue"}>Studo</span> {result && result?.profile && result.profile.displayName}</span>
                        <Image
                            src="/icons/verified.svg"
                            alt="verified"
                            width={20}
                            height={20}
                            className="flex-shrink-0"
                        />
                    </div>
                </div>
            </div>
            <div className={"w-full h-15 flex relative flex-col"}>
                <div className={"w-full flex flex-row gap-3 px-5 bg-studogrey py-2 rounded-full"}>
                    <span className={`opacity-50 transition-all duration-300 min-w-12 text-center cursor-pointer ${activePage === "tracks" ? "font-bold opacity-100": "opacity-50"}`}
                          onClick={() => {toggleActivePage("tracks");}}>
                        {t("tracks")}
                    </span>
                    |
                    <span className={`opacity-50 min-w-12 transition-all duration-300 text-center cursor-pointer ${activePage === "sets" ? "font-bold opacity-100": "opacity-50"}`}
                          onClick={() => {toggleActivePage("sets");}}>
                        {t("sets")}
                    </span>
                    |
                    <span className={`opacity-50 min-w-12 transition-all duration-300 text-center cursor-pointer ${activePage === "communities" ? "font-bold opacity-100": "opacity-50"}`}
                          onClick={() => {toggleActivePage("communities");}}>
                        {t("communities")}
                    </span>
                </div>
            </div>

            <div className={"w-full h-full flex flex-row gap-3"}>
                <div className={"w-full h-full"}></div>
                <div className={"w-1/3 h-1/2 rounded-4xl border border-studoborder glass-rgb"}></div>
            </div>
        </div>
    </div>)
}