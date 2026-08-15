"use client";

import Banner from "@studo/ui/design_system/banner/Banner";
import { ProfileResponse } from "@studo/types";
import Avatar from "@studo/ui/design_system/avatar/Avatar";
import { useImageTextColor } from "@/hooks/overige/useImageTextColor";
import BaseToolTip from "@studo/ui/design_system/tooltip/BaseToolTip";
import { useLocale, useTranslations } from "next-intl";
import { Hash } from "lucide-react";
import Verified from "@/components/ui/overige/icons/Verified";

interface ProfileHeaderProps {
  profile: ProfileResponse;
}

const FALLBACK_BANNER =
  "https://static.vecteezy.com/ti/gratis-fotos/p2/3279132-panorama-lucht-met-wolk-op-een-zonnige-dag-gratis-foto.jpg";

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const pf = profile.profile;
  const locale = useLocale();
  const bannerSrc = pf.bannerUrl || FALLBACK_BANNER;
  const t = useTranslations("profile");
  const isDark = useImageTextColor(bannerSrc, {
    left: 100,
    top: 30,
    width: 200,
    height: 50,
  });

  const joinDate = new Date(pf.joinDate)
    .toLocaleDateString(locale)
    .split("-")
    .join("/");
  if (!pf.bannerUrl) {
    return (
      <div
        className={
          "w-full flex flex-col gap-5 p-5 justify-center min-h-30 bg-studogrey/30 rounded-full border border-studoborder/30"
        }
      >
        <div className={"w-full h-fit relative flex gap-5"}>
          <Avatar size={80} id={pf.userId} displayName={pf.displayName} />
          <div className={"flex flex-col justify-center gap-2"}>
            <div className={"w-fit flex items-center justify-center gap-2"}>
              <span
                className={`text-xl truncate dark:text-white text-studodarkblue`}
              >
                {pf?.displayName}
              </span>
              <div
                className={
                  "flex flex-row items-center gap-1 px-2 py-1 rounded-full bg-studogrey/30"
                }
              >
                {pf?.verified && (
                  <Verified
                    variant={pf?.joinNumber === 1 ? "gold" : "blue"}
                    size={18}
                  />
                )}
                <BaseToolTip content={pf.joinNumber}>
                  <Hash size={15} />
                </BaseToolTip>
              </div>
            </div>
            <span className={"text-sm text-studogrey"}>
              {t("joined")} {joinDate}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={"w-full h-50 relative flex"}>
      <Banner banner={bannerSrc}>
        <div
          className={
            "absolute bottom-0 z-40 md:w-1/2 w-full md:h-25 flex md:flex-row flex-col items-center p-5 gap-2"
          }
        >
          <Avatar size={80} id={pf.userId} displayName={pf.displayName} />
          <div
            className={
              "w-fit flex flex-col backdrop-blur-2xl gap-2 items-center justify-center rounded-full px-3 "
            }
          >
            <div className={"w-fit flex items-center justify-center gap-2"}>
              <span
                className={`text-xl truncate ${isDark ? "text-white" : "text-studodarkblue"}`}
              >
                {pf?.displayName}
              </span>
              {pf?.verified && (
                <Verified
                  variant={pf?.joinNumber === 1 ? "gold" : "blue"}
                  size={18}
                />
              )}
            </div>
          </div>
        </div>
      </Banner>
    </div>
  );
}
