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
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import { ArrowRight, GalleryVerticalEnd, Images } from "lucide-react";
import BottomCredits from "@/components/ui/design_system/bottom_credits/BottomCredits";

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
  useCourseNav([
    {
      title: "account",
      href: `/account`,
      isLast: true,
      translate: true,
    },
  ]);

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
                icon: <GalleryVerticalEnd size={15} />,
              },
              {
                key: "vs",
                label: t("vs"),
                icon: <Images size={15} />,
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
      <BottomCredits />
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
        "w-full cursor-pointer h-15 rounded-4xl border bg-studogrey/30 border-studoborder/30 hover:border-studoborder transition-all duration-300 flex justify-between items-center px-5 gap-2"
      }
    >
      <div className={"flex flex-row items-center gap-3"}>
        <GalleryVerticalEnd size={18} />
        <div>
          <span className={"font-bold dark:text-white text-studodarkblue"}>
            {item.title}
          </span>
        </div>
      </div>
      <ArrowRight size={20} />
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
        "w-full cursor-pointer h-15 rounded-xl border bg-studogrey/30 border-studoborder/30 hover:border-studoborder transition-all duration-300 flex justify-between items-center px-5 gap-2"
      }
    >
      <div className={"flex flex-row items-center gap-2"}>
        <Images size={18} />
        <div>
          <span className={"font-bold dark:text-white text-studodarkblue"}>
            {item.title}
          </span>
        </div>
      </div>
      <ArrowRight size={20} />
    </Link>
  );
};
