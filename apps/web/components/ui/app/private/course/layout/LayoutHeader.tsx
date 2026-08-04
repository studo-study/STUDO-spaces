"use client";
import { Link } from "@/i18n/routing";
import { ArrowRight, ChevronLeft } from "lucide-react";
import OnlineScanner from "@/components/ui/app/private/app_header/SocialSection";
import {
  SpecialeDag,
  SpecialeDagTitel,
} from "@/components/ui/app/private/app_header/SpecialeDag";
import BreadCrumbs from "@/components/ui/app/private/course/layout/BreadCrumbs";

const LayoutHeader = () => {
  const openbrein = process.env.NEXT_PUBLIC_OPENBREIN === "true";
  const beta = process.env.NEXT_PUBLIC_BETA === "true";
  const premium = process.env.NEXT_PUBLIC_PREMIUM === "true";
  return (
    <div className={"h-fit z-100 top-0 w-screen flex flex-col"}>
      <div className={"w-screen h-0.5"}></div>
      {openbrein && (
        <div
          className={"w-screen h-7 bg-white  flex items-center justify-center "}
        >
          <span
            className={"w-full flex flex-row items-center justify-center gap-1"}
          >
            try{" "}
            <Link
              target={"_blank"}
              href={"https://openbrein.org/"}
              className={
                "font-montserrat hover:opacity-75 underline font-black"
              }
            >
              OPENBREIN
            </Link>{" "}
            for free <ArrowRight size={18} />
          </span>
        </div>
      )}
      <div className=" w-screen h-20 flex items-center px-10 py-2 backdrop-blur-2xl border-gray-300 gap-5">
        {/* Left section */}
        <div className="flex items-center gap-8 min-w-fit">
          <div className="flex items-center justify-center text-2xl dark:text-white text-studodarkblue min-w-10 min-h-10">
            <Link
              href={"/your-files/courses"}
              className={
                "w-fit h-fit p-1 cursor-pointer hover:bg-studogrey/30 rounded-xl dark:text-white text-studodarkblue"
              }
            >
              <ChevronLeft />
            </Link>
          </div>
          <Link
            href={"/home"}
            title={SpecialeDagTitel()}
            className={"w-fit flex flex-row gap-1"}
          >
            {premium ? (
              <span
                className={
                  "font-georgia text-3xl font-bold truncate flex flex-row gap-1 bg-linear-to-r bg-clip-text text-transparent transition-all duration-300 from-indigo-300 to-blue-300"
                }
              >
                Studo Select
              </span>
            ) : (
              <span
                className={`font-georgia text-3xl font-bold truncate flex flex-row gap-1 bg-linear-to-r ${SpecialeDag()} bg-clip-text text-transparent transition-all duration-300`}
              >
                Studo
              </span>
            )}
            {beta && (
              <span
                className={
                  "text-emerald-800 dark:text-blue-400 text-xs font-georgia"
                }
              >
                beta
              </span>
            )}
          </Link>
          {!premium && !beta && (
            <Link
              href={"/select"}
              className={
                "hover:scale-105 transition-all duration-300 px-5 py-1 text-sm font-bold shadow-2xl rounded-4xl border-studoborder bg-white backdrop-blur-2xl text-studodarkblue"
              }
            >
              upgrade to select
            </Link>
          )}
        </div>
        <div className={"h-full min-w-0 flex-1 flex items-center"}>
          <BreadCrumbs />
        </div>
        <div className={"w-fit h-fit flex justify-end items-center gap-2"}>
          <OnlineScanner />
        </div>
      </div>
    </div>
  );
};

LayoutHeader.displayName = "LayoutHeader";
export default LayoutHeader;
