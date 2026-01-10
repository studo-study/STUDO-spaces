"use client"
import { FaYoutube } from "react-icons/fa6";

import Link from "next/link";
import {useTranslations} from "next-intl";
export default function LandingFooter() {
    const t = useTranslations("landing.footer");
    const CurrentYear = new Date().getFullYear();

    return (
        <footer className="w-full flex flex-col text-white">
            <div className="w-full flex items-center justify-center py-8 bg-white dark:bg-[#182536]">
        <span className="font-bold text-2xl text-emerald-400 dark:text-white">
          {t("footerQuote")}
        </span>
            </div>

            <div className="w-full py-10 bg-emerald-400 dark:bg-[#182536] flex flex-col items-center">
                <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
                        <div className="md:col-span-2 flex flex-col gap-8">
                            <span className="font-bold font-akira text-4xl lg:text-5xl text-white">STUDO</span>
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
                            <span className="font-bold text-xl">{t("aboutTitle").toUpperCase()}</span>
                            <Link href="/about-us" className="hover:underline">{t("aboutBlock1")}</Link>
                            <Link href="/privacy" className="hover:underline">{t("aboutBlock2")}</Link>
                            <Link href="/terms-of-service" className="hover:underline">{t("aboutBlock3")}</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-xl">{t("ss").toUpperCase()}</span>
                            <Link href="/login" className="hover:underline">{t("ssBlock1")}</Link>
                            <Link href="/login" className="hover:underline">{t("ssBlock2")}</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="font-bold text-xl">{t("vs").toUpperCase()}</span>
                            <Link href="/login" className="hover:underline">{t("vsBlock1")}</Link>
                            <Link href="/login" className="hover:underline">{t("vsBlock2")}</Link>
                        </div>
                    </div>

                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-base px-6 sm:px-0">
                        <p className="dark:hidden text-center sm:text-left">
                            {t("loveGreen")}
                        </p>
                        <p className="hidden dark:flex text-center sm:text-left">
                            {t("loveBlue")}
                        </p>
                        <p className="text-xs opacity-75 order-first sm:order-none">
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