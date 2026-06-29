"use client";
import ProfileHeader from "@/components/ui/app/shared/profile/ProfileHeader";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import { useProfile } from "@/hooks/app/profile/useProfiles";
import { usePublicProfile } from "@/hooks/app/profile/usePublicProfile";
import { SegmentedControls } from "@/components/ui/design_system/segmentedcontrols/SegmentedControls";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { StudysetResponse, VisualsetResponse } from "@studo/types";

interface viewProps {
  id: string;
  isPublic?: boolean;
}

type Tab = "ss" | "vs";

export default function ProfileView({ id, isPublic = false }: viewProps) {
  const authenticatedResult = useProfile(id);
  const publicResult = usePublicProfile(id);
  const profile = (isPublic ? publicResult : authenticatedResult)?.data;
  const t = useTranslations("profile");
  const [tab, setTab] = useState<Tab>("ss");

  if (!profile) return null;

  return (
    <PageContainer>
      <ProfileHeader profile={profile} />
      <div className={"w-full flex flex-col gap-3"}>
        <div className={"h-10 w-full flex flex-row"}>
          <SegmentedControls
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
          <div className={"w-full h-fit flex flex-col mt-5 gap-3"}>
            {profile.studysets.map((set, i) => (
              <StudosetItem item={set} key={i} />
            ))}
          </div>
        ) : (
          <div className={"w-full h-fit flex flex-col mt-5 gap-3"}>
            {profile.visualsets.map((set, i) => (
              <VisualsetItem item={set} key={i} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

interface StudosetItemProps {
  item: StudysetResponse;
}
const StudosetItem = ({ item }: StudosetItemProps) => {
  return (
    <Link
      href={"/studoset/" + item.id}
      className={
        "w-full cursor-pointer h-10 rounded-xl border bg-studogrey/30 border-studoborder/30 hover:border-studoborder transition-all duration-300 flex justify-between items-center px-5 gap-2"
      }
    >
      <div className={"flex flex-row gap-2"}>
        <Image
          alt="settype"
          src={"/icons/studyset.svg"}
          width={5}
          height={5}
          className={"w-4 dark:invert dark:brightness-0"}
        />
        <div>
          <span className={"font-bold dark:text-white text-studodarkblue"}>
            {item.title}
          </span>
        </div>
      </div>
    </Link>
  );
};

interface VisualsetItemProps {
  item: VisualsetResponse;
}

const VisualsetItem = ({ item }: VisualsetItemProps) => {
  return (
    <Link
      href={"/visualset/" + item.id}
      className={
        "w-full cursor-pointer h-10 rounded-xl border bg-studogrey/30 border-studoborder/30 hover:border-studoborder transition-all duration-300 flex justify-between items-center px-5 gap-2"
      }
    >
      <div className={"flex flex-row gap-2"}>
        <Image
          alt="settype"
          src={"/icons/visualset.svg"}
          width={5}
          height={5}
          className={"w-4 dark:invert dark:brightness-0"}
        />
        <div>
          <span className={"font-bold dark:text-white text-studodarkblue"}>
            {item.title}
          </span>
        </div>
      </div>
    </Link>
  );
};
