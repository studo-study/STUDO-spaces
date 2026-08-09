"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import classNames from "@/utils/classnames";
import { useUser } from "@/components/providers/auth/UserProvider";
export default function PersonalInfo(props: SettingsSection) {
  const { isVisible } = props;
  const t = useTranslations("settings");
  const user = useUser().user;
  const [editName, setEditName] = useState<boolean>(false);
  const [editMail, setEditMail] = useState<boolean>(false);
  const [editRole, setEditRole] = useState<boolean>(false);
  const [editPassword, setEditPassword] = useState<boolean>(false);

  useCourseNav([
    {
      title: "settings",
      href: "/settings",
      isLast: true,
      translate: true,
    },
  ]);

  const toggleEditName = () => {
    setEditName((prev) => !prev);
  };
  const toggleEditMail = () => {
    setEditMail((prev) => !prev);
  };
  const toggleEditRole = () => {
    setEditRole((prev) => !prev);
  };

  const toggleEditPassword = () => {
    setEditPassword((prev) => !prev);
  };
  if (isVisible != "account") {
    return;
  }

  const personalInfo = [
    {
      label: t("username"),
      editMode: editName,
      value: user?.displayName,
      type: "text",
      onclick: toggleEditName,
    },
    {
      label: t("email"),
      editMode: editMail,
      value: user?.email,
      type: "text",
      onclick: toggleEditMail,
    },
    {
      label: t("role"),
      editMode: editRole,
      value: user?.publicRole,
      type: "text",
      onclick: toggleEditRole,
    },
    {
      label: t("password"),
      editMode: editPassword,
      value: "wachtwoord",
      type: "password",
      onclick: toggleEditPassword,
    },
  ];
  return (
    <section className={"flex flex-col gap-5 w-full min-h-fit"}>
      <span className={"w-full text-base font-bold h-fit"}>
        {t("personal info")}
      </span>
      <div
        className={
          "w-full min-h-40 h-fit rounded-3xl border border-studoborder/30 divide-studoborder/30 divide-y "
        }
      >
        {personalInfo.map((option, index) => {
          return (
            <div
              key={option.label + index}
              className={"w-full gap-2 p-5 flex flex-col"}
            >
              <span className={"w-full text-xs opacity-50 font-bold h-fit"}>
                {option.label}
              </span>
              <div
                className={"w-full flex items-center flex-row justify-between"}
              >
                <input
                  value={option.value}
                  disabled={!option.editMode}
                  autoFocus={option.editMode}
                  className={classNames(
                    " w-fit max-w-fit outline-none border-b border-transparent",
                    option.editMode && " border-studoblue",
                  )}
                  type={option.type}
                />
                <BaseButton
                  size={"sm"}
                  variant={"hover"}
                  onClick={option.onclick}
                  className={
                    option.editMode
                      ? "bg-studoblue hover:bg-studoblue"
                      : "text-blue-500"
                  }
                >
                  {option.editMode ? t("save") : t("edit")}
                </BaseButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
