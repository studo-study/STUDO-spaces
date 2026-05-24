"use client";
import ProfileHeader from "@/components/ui/public/profile/ProfileHeader";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import { useProfile } from "@/hooks/app/profile/useProfiles";
import { TabSwitcher } from "@/components/ui/design_system/tabswitcher/TabSwitcher";
import { RiAiGenerate } from "react-icons/ri";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface viewProps {
  id: string;
}

type Tab = "ss" | "vs";

export default function ProfileView({ id }: viewProps) {
  const profile = useProfile(id)?.data;
  const t = useTranslations("profile");
  const [tab, setTab] = useState<Tab>("ss");
  console.log(profile);
  if (!profile) return null;
  console.log(profile);
  return (
    <PageContainer>
      <ProfileHeader profile={profile} />
      <div className={"w-full flex flex-col gap-3"}>
        <div className={"h-10 w-full flex flex-row"}>
          <TabSwitcher
            tabs={[
              {
                key: "ss",
                label: t("ss"),
              },
              {
                key: "vs",
                label: t("vs"),
              },
            ]}
            value={tab}
            onChange={(key) => {
              setTab(key as Tab);
            }}
          />
        </div>
        {tab === "ss" ? (
          <div className={"w-full h-fit flex flex-col"}></div>
        ) : (
          <div className={"w-full h-fit flex flex-col"}></div>
        )}
      </div>
    </PageContainer>
  );
}
