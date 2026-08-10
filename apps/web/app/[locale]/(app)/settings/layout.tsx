"use client";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Tabs } from "@/components/ui/design_system/tabs/Tabs";
import {
  BadgeCheck,
  Bell,
  Bug,
  PersonStanding,
  SlidersHorizontal,
  UserRoundCog,
} from "lucide-react";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("settings");
  const pathname = usePathname();
  const segment = pathname.split("/")[2] ?? "account";
  const active = segment === "settings" ? "account" : segment;

  return (
    <>
      <span className={"w-full h-fit font-bold text-3xl gap-10"}>
        {t("title")}:
      </span>
      <div className={"w-full flex-row flex mb-5"}>
        <Tabs
          value={active}
          onChange={() => {}}
          tabs={[
            {
              key: "account",
              href: "/settings/account",
              label: t("account"),
              icon: <UserRoundCog size={15} />,
            },
            {
              key: "app",
              href: "/settings/app",
              label: t("app"),
              icon: <SlidersHorizontal size={15} />,
            },
            {
              key: "access",
              href: "/settings/access",
              label: t("access"),
              icon: <PersonStanding size={15} />,
            },
            {
              key: "notifications",
              href: "/settings/notifications",
              label: t("notifications"),
              icon: <Bell size={15} />,
            },
            {
              key: "select",
              href: "/settings/select",
              label: t("select"),
              icon: <BadgeCheck size={15} />,
            },
            {
              key: "developer",
              href: "/settings/developer",
              label: t("developer"),
              icon: <Bug size={15} />,
            },
          ]}
        />
      </div>
      <div className={"flex flex-col gap-20 min-w-0 flex-1 min-h-0 w-full"}>
        {children}
        <BottomCredits />
      </div>
    </>
  );
}
