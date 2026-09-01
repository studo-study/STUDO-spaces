"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import SimpleMenu from "@studo/ui/design_system/simple_menu/SimpleMenu";
import { BookOpen, ChevronRight, GalleryVerticalEnd, Plus } from "lucide-react";

interface TriggerAddProps {
  AddIsOpen: boolean;
  setAddIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCreate: () => void;
}
/*
const createVisualset= {
    to: "/create-visualset",
    icon: "/icons/visualset.svg",
    label: "create_vs",
    color: "from-blue-400 to-indigo-500",
    key: "v",
  }*/

export default function TriggerAddPopup({ toggleCreate }: TriggerAddProps) {
  const t = useTranslations("header");

  return (
    <SimpleMenu
      trigger={
        <button className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300">
          <div className="absolute bg-blue-500/50 h-10 w-10 rounded-full blur-sm" />
          <div className="relative z-10 shadow-2xl bg-blue-500 h-10 min-w-10 text-3xl flex items-center justify-center text-white rounded-full border border-neutral-200">
            <Plus size={20} />
          </div>
        </button>
      }
    >
      {(isOpen: boolean) => {
        return (
          <div className="relative flex flex-col gap-1">
            <div
              onClick={toggleCreate}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
                text-studodarkblue dark:text-white cursor-pointer
                hover:bg-linear-to-r hover:from-violet-400 to-purple-500 hover:text-white
                transition-all duration-200 ease-out
                ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
              `}
              style={{
                transitionDelay: isOpen ? `${0}ms` : "0ms",
              }}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg
                bg-linear-to-br from-violet-400 to-purple-500
                shadow-md shadow-black/10
                group-hover:scale-110 group-hover:shadow-lg
                transition-all duration-200`}
              >
                <BookOpen size={15} />
              </div>
              <span className="font-medium text-sm">{t("create_c")}</span>
              <ChevronRight
                size={20}
                className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </div>
            {menuItems.map((item, index) => (
              <Link
                key={item.to}
                href={item.to}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
                text-studodarkblue dark:text-white
                hover:bg-linear-to-r hover:${item.color} hover:text-white
                transition-all duration-200 ease-out
                ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
              `}
                style={{
                  transitionDelay: isOpen ? `${(index + 2) * 50}ms` : "0ms",
                }}
              >
                <div
                  className={`flex items-center justify-center min-w-8 h-8 rounded-lg
                  bg-linear-to-br ${item.color}
                  shadow-md shadow-black/10
                  group-hover:scale-110 group-hover:shadow-lg
                  transition-all duration-200`}
                >
                  {item.icon}
                </div>
                <div className="font-medium text-sm flex flex-row items-center justify-between w-full">
                  <span>{t(item.label)}</span>
                </div>
                <ChevronRight
                  size={20}
                  className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                />
              </Link>
            ))}
          </div>
        );
      }}
    </SimpleMenu>
  );
}

const menuItems = [
  {
    to: "/create-studoset",
    icon: <GalleryVerticalEnd size={15} />,
    label: "create_ss",
    color: "from-emerald-400 to-teal-500",
    key: "s",
  },
];
