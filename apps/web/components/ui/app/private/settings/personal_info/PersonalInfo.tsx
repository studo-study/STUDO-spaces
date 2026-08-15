"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import classNames from "@/utils/classnames";
import { useUser } from "@/components/providers/auth/UserProvider";
import { useUpdateUser } from "@/hooks/app/account/useUpdateUser";
export default function PersonalInfo() {
  const t = useTranslations("settings");
  const user = useUser().user;
  const { mutate } = useUpdateUser();
  const [editName, setEditName] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [editMail, setEditMail] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [editRole, setEditRole] = useState<boolean>(false);
  const [role, setRole] = useState("");
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
    if (editName) mutate({ displayName: name });
    setEditName((prev) => !prev);
  };
  const toggleEditMail = () => {
    if (editMail) mutate({ email: email });
    setEditMail((prev) => !prev);
  };
  const toggleEditRole = () => {
    if (editRole) mutate({ role: role });
    setEditRole((prev) => !prev);
  };

  const toggleEditPassword = () => {
    setEditPassword((prev) => !prev);
  };

  const personalInfo = [
    {
      label: t("username"),
      editMode: editName,
      value: user?.displayName,
      type: "text",
      onclick: toggleEditName,
      onchange: (input: string) => {
        setName(input);
      },
    },
    {
      label: t("email"),
      editMode: editMail,
      value: user?.email,
      type: "text",
      onclick: toggleEditMail,
      onchange: (input: string) => {
        setEmail(input);
      },
    },
    {
      label: t("role"),
      editMode: editRole,
      value: user?.publicRole,
      type: "text",
      onclick: toggleEditRole,
      onchange: (input: string) => {
        setRole(input);
      },
    },
    {
      label: t("password"),
      editMode: editPassword,
      value: "wachtwoord",
      type: "password",
      onclick: toggleEditPassword,
      onchange: (input: string) => {
        setName(input);
      },
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
                  defaultValue={option.value}
                  disabled={!option.editMode}
                  autoFocus={option.editMode}
                  onChange={(e) => option.onchange(e.target.value)}
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
