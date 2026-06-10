"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Classroom } from "@/types/types";
import { mockFullClassrooms } from "@/data/mocks/classroomsMock";
import { IoSchoolOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoIosAdd } from "react-icons/io";
import { ImLink } from "react-icons/im";
import { useState } from "react";
import TriggerInvite from "@/components/ui/app/private/classroom/header/TriggerInvite";
import InvitePeople from "@/components/ui/app/private/classroom/header/InvitePeople";
import AddSet from "@/components/ui/app/private/classroom/header/AddSet";
import TriggerSettings from "@/components/ui/app/private/classroom/header/Settings";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

const classroom: Classroom = mockFullClassrooms[0];

export default function PrivateClassroomHeader() {
  const t = useTranslations("classroom");
  const pathname = usePathname();
  const items = [
    { link: `/classroom/${classroom.id}/sets`, label: "set_title" },
    { link: `/classroom/${classroom.id}/members`, label: "users" },
  ];
  const rest = [
    {
      link: `/classroom/${classroom.id}/challenges`,
      label: "challenges_title",
    },
  ];

  const [invite, setInvite] = useState(false);
  const [add, setAdd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [SettingsIsOpen, setSettingsIsOpen] = useState(false);

  const toggleCopiedAnimation = () => {
    setCopied(true);
    console.log("animatie getriggered");
    setTimeout(() => {
      setCopied(false);
    }, 750);
  };
  const toggleInvitePopUp = () => {
    setInvite((prev) => !prev);
  };

  const toggleAddPopUp = () => {
    setAdd((prev) => !prev);
  };

  const toggleSettings = () => {
    setSettingsIsOpen((prev) => !prev);
  };

  const copyText = "www.studo.study" + pathname;
  const copy = () => {
    navigator.clipboard.writeText(copyText);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Header row */}
      <div className="w-full flex items-center justify-between dark:text-white text-studodarkblue">
        <div className="min-w-fit font-georgia truncate font-bold text-2xl flex flex-row gap-5 items-center">
          <span>{classroom.name}</span>
          <div>{getClassroomType(classroom.type)}</div>
        </div>
        <div className="w-fit flex flex-row items-center text-xl justify-center gap-5">
          <button
            onClick={toggleAddPopUp}
            className="relative flex z-10 items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
          >
            <div className="absolute bg-amber-500/50 h-7 w-7 rounded-full blur-sm" />
            <div className="relative z-10 shadow-2xl bg-amber-500 min-h-7 min-w-7 text-xl flex items-center justify-center text-white rounded-full border border-studoborder">
              <IoIosAdd />
            </div>
          </button>
          <TriggerSettings
            SettingsIsOpen={SettingsIsOpen}
            setSettingsIsOpen={setSettingsIsOpen}
            toggleSettings={toggleSettings}
          />
        </div>
      </div>

      {/* School name */}
      <span className="w-full dark:text-white opacity-50 text-base flex gap-2 items-center">
        <LiaUniversitySolid />
        <span>{classroom.school}</span>
      </span>

      {/* Tab bar */}
      <div className="relative w-full mt-4">
        <div className="relative z-20 w-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            {items.map((item) => (
              <Link
                href={item.link}
                key={item.label}
                className={`dark:text-white font-bold py-4 transition-all duration-400 hover:border-blue-500/75 border-b-2 ${
                  isActive(item.link, pathname)
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                {t(item.label)}
              </Link>
            ))}
            {classroom.type !== "communtiy" &&
              rest.map((item) => (
                <Link
                  href={item.link}
                  key={item.label}
                  className={`dark:text-white font-bold py-4 transition-all duration-400 hover:border-blue-500/75 border-b-2 ${
                    isActive(item.link, pathname)
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
          </div>

          <div className="flex flex-row items-center gap-5 pb-3">
            <TriggerInvite togglePopUp={toggleInvitePopUp} />
            <BaseButton
              label={t("copy")}
              iconLeft={<ImLink />}
              onClick={() => {
                copy();
                toggleCopiedAnimation();
              }}
              bg={`${copied ? "bg-emerald-400" : "bg-studogrey/30"} `}
            />
          </div>
        </div>
        <div className="absolute z-10 bottom-0 w-full h-0.5 bg-studogrey" />
      </div>

      {/* Modals */}
      <InvitePeople inviteOpen={invite} setInviteOpen={setInvite} />
      <AddSet addOpen={add} setAddOpen={setAdd} />
    </div>
  );
}

function getClassroomType(type: string) {
  switch (type) {
    case "class_group":
      return <IoSchoolOutline />;
    case "study_group":
      return <FaUserFriends />;
    case "community_group":
      return <TbWorld />;
  }
}

function isActive(link: string, pathname: string) {
  const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|de)/, "");
  console.log("vergelijking: ");
  return pathWithoutLocale === link || pathWithoutLocale.startsWith(link + "/");
}
