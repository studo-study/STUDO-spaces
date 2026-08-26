"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Tracks from "@/components/ui/app/shared/track/Tracks";
import Communities from "@/components/ui/app/shared/track/Communities";
import { StudoProfileResponse } from "@studo/types";

export default function TrackView() {
  const t = useTranslations("trackview");
  const param = useParams();
  const [result, setResult] = useState<StudoProfileResponse | null>(null); // [] ipv null, anders crasht .map()
  const [activePage, setActivePage] = useState("tracks");

  const toggleActivePage = (type: string) => {
    switch (type) {
      case "tracks":
        setActivePage("tracks");
        break;
      case "sets":
        setActivePage("sets");
        break;
      case "communities":
        setActivePage("communities");
        break;
    }
  };
  useEffect(() => {
    if (!param.id) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/studoprofiles/${param.id}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data); // niet data.json(), al geparsed
      });
  }, [param.id]);

  if (!result) return null;
  console.log(result);

  return (
    <div className=" mt-10 dark:text-white w-full max-w-screen md:mt-0 h-full overflow-y-scroll scroll-hidden flex flex-col items-center justify-baseline px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-0 flex-1 w-full flex-col items-center gap-3 sm:gap-5">
        <div
          className={
            "w-full pointer-events-none min-h-60 sm:min-h-72 md:min-h-80 relative overflow-hidden rounded-4xl"
          }
        >
          <div
            className={
              "relative min-w-full min-h-full rounded-4xl overflow-hidden h-full"
            }
          >
            {result?.profile && result?.profile.bannerUrl && (
              <Image
                src={result.profile.bannerUrl}
                alt="banner"
                fill
                className="object-cover rounded-3xl"
              />
            )}
          </div>
          <div
            className={
              "absolute bottom-0 z-30 w-full h-25 bg-linear-0 dark:bg-transparent dark:from-transparent dark:via-transparent dark:to-transparent from-gray-200 via-gray-50/50 to-transparent"
            }
          ></div>
          <div
            className={
              "absolute bottom-0 z-40 md:w-1/2 w-full md:h-25 flex md:flex-row flex-col items-center p-5 gap-2"
            }
          >
            <div
              className={
                "rounded-full border border-studoborder overflow-hidden w-20 h-20 min-w-20 min-h-20"
              }
            >
              <Image
                src="/icons/icon2.png"
                alt="logo"
                width={100}
                height={100}
                className="w-20 h-20 min-w-20 min-h-20 object-cover"
              />
            </div>
            <div
              className={
                "w-fit flex flex-col backdrop-blur-2xl gap-2 items-center justify-center rounded-full px-3 "
              }
            >
              <div className={"w-fit flex items-center justify-center gap-2"}>
                <span
                  className={"text-xl truncate text-gray-500 dark:text-white"}
                >
                  <span
                    className={"font-bold dark:text-white text-studodarkblue"}
                  >
                    Studo
                  </span>{" "}
                  {result?.profile?.displayName}
                </span>
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
        </div>
        <div className={"w-full h-15 flex relative flex-col"}>
          <div
            className={
              "w-full flex flex-row gap-3 px-5 bg-studogrey py-2 rounded-full"
            }
          >
            <span
              className={`opacity-50 min-w-12 text-center cursor-pointer ${activePage === "tracks" ? "font-bold opacity-100" : "opacity-50"}`}
              onClick={() => {
                toggleActivePage("tracks");
              }}
            >
              {t("tracks")}
            </span>
            |
            <span
              className={`opacity-50 min-w-12 text-center cursor-pointer ${activePage === "communities" ? "font-bold opacity-100" : "opacity-50"}`}
              onClick={() => {
                toggleActivePage("communities");
              }}
            >
              {t("communities")}
            </span>
          </div>
        </div>

        <div className={"w-full h-full flex flex-row gap-3"}>
          <div className={"w-full h-full"}>
            {activePage === "tracks" && <Tracks tracks={result.tracks} />}
            {activePage === "communities" && (
              <Communities communities={result.communities} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
