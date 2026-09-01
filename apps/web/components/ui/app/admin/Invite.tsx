"use client";

import { useState } from "react";
import { useBetaInvite } from "@/hooks/app/admin/useBetaInvite";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import { IoSend } from "react-icons/io5";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";

const Invite = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending, isSuccess, isError, error, reset } =
    useBetaInvite();

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  useCourseNav([
    {
      title: "backoffice",
      href: `/backoffice`,
      isLast: false,
      translate: true,
    },
    {
      title: "invite",
      href: `/backoffice/invite`,
      isLast: true,
      translate: true,
    },
  ]);
  const handleSend = () => {
    if (!isValid || isPending) return;
    mutate(
      { email },
      {
        onSuccess: () => setEmail(""),
      },
    );
  };

  return (
    <div className="w-full h-full flex flex-1 flex-col gap-3 items-center justify-center">
      <div
        className="min-w-1/3 lg:w-1/2 w-full h-10 flex flex-row items-center pl-5 bg-gray-300/30 dark:bg-gray-500/10
        rounded-full dark:text-white text-studodarkblue border-2 border-gray-400/30 dark:border-neutral-200/20"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (isError || isSuccess) reset();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="email@studo.study"
          className="w-full h-full outline-none bg-transparent"
        />
        <BaseButton
          icon={<IoSend />}
          onClick={handleSend}
          disabled={!isValid || isPending}
        />
      </div>

      {isPending && <p className="text-xs opacity-60">Versturen…</p>}
      {isSuccess && (
        <p className="text-xs text-green-500">Uitnodiging verstuurd</p>
      )}
      {isError && (
        <p className="text-xs text-red-500">
          {error?.message ?? "Er ging iets mis"}
        </p>
      )}
    </div>
  );
};

Invite.displayName = "Invite";
export default Invite;
