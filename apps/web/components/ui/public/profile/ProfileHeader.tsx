"use client";

import Banner from "@/components/ui/design_system/banner/Banner";
import { ProfileResponse } from "@studo/types";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import { MdVerified } from "react-icons/md";
import { useImageTextColor } from "@/hooks/overige/useImageTextColor";
import BaseToolTip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useTranslations } from "next-intl";
import { FaHashtag } from "react-icons/fa";

interface ProfileHeaderProps {
  profile: ProfileResponse;
}

const FALLBACK_BANNER =
  "https://static.vecteezy.com/ti/gratis-fotos/p2/3279132-panorama-lucht-met-wolk-op-een-zonnige-dag-gratis-foto.jpg";

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const pf = profile.profile;
  const bannerSrc = pf.banner_url || FALLBACK_BANNER;
  const t = useTranslations("account");

  if (!pf.banner_url) {
    return (
      <div
        className={
          "w-full flex flex-col gap-5 px-10 justify-center py-5 min-h-30 bg-studogrey/30 rounded-3xl border border-studoborder/30"
        }
      >
        <div className={"w-full h-fit relative flex gap-5"}>
          <Avatar size={80} id={pf.user_id} displayName={pf.displayName} />
          <div className={"w-fit flex items-center justify-center gap-2"}>
            <span
              className={`text-xl truncate dark:text-white text-studodarkblue`}
            >
              {pf?.displayName}
            </span>
            <BaseToolTip content={t("verified")}>
              <span className={"text-blue-500"}>
                {!pf.verified && <MdVerified />}
              </span>
            </BaseToolTip>
            <BaseToolTip content={pf.joinNumber}>
              <FaHashtag />
            </BaseToolTip>
          </div>
        </div>
      </div>
    );
  }
  const isDark = useImageTextColor(bannerSrc, {
    left: 100,
    top: 30,
    width: 200,
    height: 50,
  });

  return (
    <div className={"w-full h-50 relative flex"}>
      <Banner banner={bannerSrc}>
        <div
          className={
            "absolute bottom-0 z-40 md:w-1/2 w-full md:h-25 flex md:flex-row flex-col items-center p-5 gap-2"
          }
        >
          <Avatar size={80} id={pf.user_id} displayName={pf.displayName} />
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
              <span className={"text-blue-500"}>
                {!pf.verified && <MdVerified />}
              </span>
            </div>
          </div>
        </div>
      </Banner>
    </div>
  );
}
