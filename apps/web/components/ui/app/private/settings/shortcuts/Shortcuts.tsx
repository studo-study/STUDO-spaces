"use client";
import { FiCommand } from "react-icons/fi";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LuDelete } from "react-icons/lu";
import { SettingsSection } from "@/components/ui/app/private/settings/SettingsSection";
interface Shortcut {
  title: string;
  keys: ("command" | "delete" | string)[];
  premium: boolean;
}

const shortcuts: Shortcut[] = [
  { title: "create_ss", keys: ["s"], premium: false },
  { title: "create_vs", keys: ["v"], premium: false },
  { title: "create_f", keys: ["f"], premium: false },
  { title: "toggle_s", keys: ["command", "m"], premium: false },
  { title: "add_c", keys: ["command", "a"], premium: false },
  { title: "save_s", keys: ["command", "s"], premium: false },
  { title: "del_c", keys: ["command", "delete"], premium: false },
  { title: "sven_i", keys: ["command", "i"], premium: true },
];

export function Shortcuts(props: SettingsSection) {
  const { isVisible } = props;

  const t = useTranslations("settings");
  const [isMac] = useState(
    () =>
      typeof navigator !== "undefined" && navigator.platform.includes("Mac"),
  );

  if (isVisible != "access") {
    return;
  }

  return (
    <section className={"flex flex-col gap-5 w-full min-h-fit"}>
      <span className="w-full text-base font-bold h-fit">{t("shortcuts")}</span>

      <div className="flex flex-col divide-y divide-studoborder p-5 rounded-3xl border border-studoborder">
        {shortcuts.map((s, i) => (
          <ShortcutItem key={i} shortcut={s} isMac={isMac} />
        ))}
      </div>
    </section>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-studoborder opacity-50 max-h-5 h-5 min-w-5 max-w-5 px-1 flex items-center justify-center rounded-md">
      {children}
    </div>
  );
}

function ShortcutItem({
  shortcut,
  isMac,
}: {
  shortcut: Shortcut;
  isMac: boolean;
}) {
  const t = useTranslations("settings.shortcut_titles");

  const renderKey = (key: string) => {
    if (key === "command")
      return <KeyCap>{isMac ? <FiCommand /> : "ctrl"}</KeyCap>;
    if (key === "delete")
      return (
        <KeyCap>
          <LuDelete size={14} />
        </KeyCap>
      );
    return <KeyCap>{key}</KeyCap>;
  };

  return (
    <div className="w-full flex flex-row px-5 py-2 justify-between items-center">
      <span className="font-bold">{t(shortcut.title)}</span>
      <div className="flex gap-2 items-center text-sm">
        {shortcut.premium && <Select />}
        {shortcut.keys.map((key, i) => (
          <span key={i}>{renderKey(key)}</span>
        ))}
      </div>
    </div>
  );
}

function Select() {
  return (
    <Link href={"/select"} className={"px-3 rounded-3xl bg-studogrey/50"}>
      <span
        className={
          "font-bold h-fit bg-clip-text text-transparent truncate bg-linear-to-r from-indigo-300 to-blue-300"
        }
      >
        select
      </span>
    </Link>
  );
}
