"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Tabs } from "@/components/ui/design_system/tabs/Tabs";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminHeader() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const Router = useRouter();
  const isActive = pathname.split("/")[3];
  const [tab, setTab] = useState(isActive);
  console.log(isActive);
  return (
    <div
      className={
        "p-5 flex flex-col gap-3 items-start border-b border-studoborder/30"
      }
    >
      <span
        className={
          "text-studodarkblue dark:text-white font-bold text-2xl flex flex-row items-center gap-2 truncate"
        }
      >
        <LinkButton
          href={"/home"}
          icon={<ChevronLeft size={20} />}
          variant={"hover"}
          size={"md"}
        />
        {t("title")}
      </span>
      <Tabs
        tabs={[
          {
            key: "stats",
            label: t("stats"),
          },
          {
            key: "reports",
            label: t("reports"),
          },
          {
            key: "users",
            label: t("users"),
          },
          {
            key: "search",
            label: t("search"),
          },
          {
            key: "invite",
            label: t("invite"),
          },
        ]}
        value={tab}
        onChange={(input) => {
          setTab(input);
          Router.push("/admin/" + input);
        }}
      />
    </div>
  );
}
