"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IoMdSettings } from "react-icons/io";
import { useUser } from "@/components/providers/auth/UserProvider";
import Avatar from "@/components/ui/design_system/avatar/Avatar";
import BaseTooltip from "@/components/ui/design_system/tooltip/BaseToolTip";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import Verified from "@/components/ui/overige/icons/Verified";
import Streak from "@/components/ui/overige/icons/Streak";
import { useState } from "react";

export default function AccountHeader() {
  const t = useTranslations("account");
  const [streakOpen, setStreakOpen] = useState<boolean>(false);
  const user = useUser().user;
  useCourseNav([
    {
      title: "account",
      href: `/account`,
      isLast: true,
      translate: true,
    },
  ]);

  return (
    <div
      className={
        "w-full flex flex-col gap-5 px-10 justify-center py-5 min-h-50 bg-studogrey/30 rounded-3xl border border-studoborder/30"
      }
    >
      <div
        className={
          "w-full h-fit  items-center justify-baseline flex flex-row gap-10"
        }
      >
        <div
          className={
            "max-w-25 max-h-25 overflow-hidden min-w-25 min-h-25 rounded-full flex items-center justify-center bg--500"
          }
        >
          {user && (
            <Avatar id={user.id} displayName={user.displayName} size={100} />
          )}
        </div>
        <div className={"w-full h-fit flex flex-col gap-5"}>
          <div
            className={
              "w-full h-fit text-2xl flex flex-row items-center gap-3 font-bold dark:text-white text-studodarkblue justify-between"
            }
          >
            <div className="flex items-center gap-3">
              <span>{user?.displayName}</span>
              <div
                className={
                  "flex flex-row items-center gap-1 px-2 py-1 rounded-full bg-studogrey/30"
                }
              >
                {user && (
                  <BaseTooltip content={user.joinNumber}>
                    <span className={"text-base cursor-pointer mx-0.5"}>#</span>
                  </BaseTooltip>
                )}

                {user?.streakCount != 0 && (
                  <Link href={"/streak"} className={"h-full flex items-center"}>
                    <Streak
                      popup={false}
                      streak={user?.streakCount ?? 0}
                      StreakOpen={streakOpen}
                      setStreakOpen={setStreakOpen}
                    />
                  </Link>
                )}
                {user?.verified && (
                  <Verified
                    variant={user?.publicRole === "owner" ? "gold" : "blue"}
                    size={18}
                  />
                )}
              </div>
            </div>

            <Link
              href={"/settings/account"}
              className={
                "text-sm h-fit text-blue-500 flex gap-2 items-center hover:underline "
              }
            >
              <IoMdSettings />
              {t("settings")}
            </Link>
          </div>
          <div className={"w-full flex gap-10"}>
            <div className={"w-fit flex flex-col"}>
              <span className={"text-sm font-bold text-studogrey"}>
                {t("role")}
              </span>
              <span
                className={
                  "w-full truncate overflow-hidden dark:text-white text-studodarkblue"
                }
              >
                {user?.publicRole ? t(user.publicRole) : ""}
              </span>
            </div>
            <div className={"w-fit flex flex-col"}>
              <span className={"text-sm font-bold text-studogrey"}>
                {t("mail")}
              </span>
              <span
                className={
                  "w-full truncate overflow-hidden dark:text-white text-studodarkblue"
                }
              >
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
