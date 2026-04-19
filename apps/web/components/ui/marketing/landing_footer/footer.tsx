"use client"
import { FaYoutube } from "react-icons/fa6";

import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";
import {GiEuropeanFlag} from "react-icons/gi";
import {MdOutlinePrivacyTip, MdPrivacyTip} from "react-icons/md";
import Image from "next/image";
export default function LandingFooter() {
    const t = useTranslations("landing.footer");
    const CurrentYear = new Date().getFullYear();
    const launched = false;

    return (
        <footer className="w-full flex flex-col text-white">
            <div className="w-full flex items-center justify-center py-8 bg-white dark:bg-[#182536]">
        <span className="font-bold text-2xl text-emerald-400 dark:text-white">
          {t("footerQuote")}
        </span>
            </div>

            <div className="w-full bg-emerald-400 py-10 dark:bg-[#182536] flex flex-col items-center">
                <div className="w-full  max-w-7xl px-6 sm:px-8 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
                        <div className="md:col-span-2 flex flex-col gap-8">
                            <div className="flex-row flex items-center gap-1">
                                <Image src={"/logo/hat.svg"} alt={"hat"} height={0} width={0} className={"w-20"}/>
                                <span className="font-bold font-georgia text-5xl lg:text-5xl text-white">Studo</span>
                            </div>

                            <div className="flex flex-row gap-5 items-center">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <img src={"/icons/socialmedia/instagram-svgrepo-com.svg"} alt="Instagram" className="h-10 invert" />
                                </a>
                                <a href="https://www.tiktok.com/@studo.study" target="_blank" rel="noopener noreferrer">
                                    <img src={"/icons/socialmedia/tiktok-svgrepo-com.svg"} alt="TikTok" className="h-7 invert" />
                                </a>
                                <a href="https://www.youtube.com/@STUDO-app" target="_blank" rel="noopener noreferrer">
                                    <FaYoutube size={30} />
                                </a>
                                <a href="https://www.linkedin.com/company/studo" target="_blank" rel="noopener noreferrer">
                                    <img src={"/icons/socialmedia/linkedin-svgrepo-com.svg"} alt="LinkedIn" className="h-10 invert" />
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="font-bold font-roboto">{t("aboutTitle").toUpperCase()}</span>
                            <Link href="/about-us" className="hover:underline">{t("aboutBlock1")}</Link>
                            <Link href="/privacy" className="hover:underline">{t("aboutBlock2")}</Link>
                            <Link href="/terms-of-service" className="hover:underline">{t("aboutBlock3")}</Link>
                            {launched && <Link href="/GDPR" className="hover:underline">{t("GDPR")}</Link>}
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="font-bold font-roboto">{t("selectTitle").toUpperCase()}</span>
                            <Link href="/studo-select" className="hover:underline">{t("select")}</Link>
                            <Link href="/studo-for-education" className="hover:underline">{t("edu")}</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="font-bold font-roboto">{t("setTitle").toUpperCase()}</span>
                            <Link href="/create-studoset" className="hover:underline">{t("ssBlock1")}</Link>
                            <Link href="/your-files/sets" className="hover:underline">{t("ssBlock2")}</Link>
                            <Link href="/create-visualset" className="hover:underline">{t("vsBlock1")}</Link>
                            <Link href="/your-files/sets" className="hover:underline">{t("vsBlock2")}</Link>
                        </div>

                    </div>

                    <div className="w-full flex flex-col font-roboto uppercase sm:flex-row items-center justify-between gap-4 text-xs  opacity-50 px-6 sm:px-0">
                        <div className={"w-1/3 flex flex-row  items-center gap-4 h-20"}>
                            <div className={"w-1/2 h-10 rounded-full flex items-center gap-2"}>
                                <GiEuropeanFlag size={25}/>
                                <span><span className={"font-bold"}>{t("gdpr")}</span> {t("compliant")}</span>
                            </div>
                            <div className={"w-fit h-10 rounded-full flex items-center gap-2"}>
                                <MdOutlinePrivacyTip size={20}/>
                                <span><span className={"font-bold"}>{t("privacy")}</span> {t("first")}</span>
                            </div>
                        </div>
                        <p className=" order-first sm:order-none">
                            {t("Version")} {process.env.NEXT_PUBLIC_VERSION}
                        </p>
                        <p className="text-center sm:text-right">
                            &copy; {CurrentYear} {t("rights")}
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

function sets() {
    const t = useTranslations();
    return (<>
            <Link href="/your-files/sets" className="hover:underline">{t("ssBlock1")}</Link>
            <Link href="/create-studoset" className="hover:underline">{t("ssBlock2")}</Link>
            <Link href="/your-files/sets" className="hover:underline">{t("vsBlock1")}</Link>
            <Link href="/create-visualset" className="hover:underline">{t("vsBlock2")}</Link>
        </>

    )
}