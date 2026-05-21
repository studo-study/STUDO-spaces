"use client";
import Image from "next/image";
import { IoIosAdd } from "react-icons/io";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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

export default function TriggerAddPopup({
  AddIsOpen,
  setAddIsOpen,
  toggleCreate,
}: TriggerAddProps) {
  const containerRef = useRef(null);
  const togglePopUp = () => {
    setAddIsOpen((prev) => !prev);
  };

  return (
    <button
      onClick={togglePopUp}
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300"
    >
      <div className="absolute bg-blue-500/50 h-10 w-10 rounded-full blur-sm" />
      <div className="relative z-10 shadow-2xl bg-blue-500 h-10 min-w-10 text-3xl flex items-center justify-center text-white rounded-full border border-studoborder">
        <IoIosAdd />
      </div>
      <AddPopUp
        AddIsOpen={AddIsOpen}
        setAddIsOpen={setAddIsOpen}
        containerRef={containerRef}
        toggleCreate={toggleCreate}
      />
    </button>
  );
}

interface AddPopupProps {
  AddIsOpen: boolean;
  setAddIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  toggleCreate: () => void;
}

const menuItems = [
  {
    to: "/create-studoset",
    icon: "/icons/studyset.svg",
    label: "create_ss",
    color: "from-emerald-400 to-teal-500",
    key: "s",
  },
];

function AddPopUp({
  AddIsOpen,
  setAddIsOpen,
  containerRef,
  toggleCreate,
}: AddPopupProps) {
  const t = useTranslations("header");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAddIsOpen(false);
      }
    };

    if (AddIsOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [AddIsOpen, setAddIsOpen, containerRef]);

  return (
    <div
      ref={popupRef}
      className={`absolute top-full right-0 mt-4
        z-[99999] w-60 p-2 truncate
        rounded-2xl
        bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${
          AddIsOpen
            ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
        }
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Menu Items */}
      <div className="relative flex flex-col gap-1">
        {menuItems.map((item, index) => (
          <Link
            key={item.to}
            href={item.to}
            onClick={() => setAddIsOpen(false)}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-studodarkblue dark:text-white
              hover:bg-gradient-to-r hover:${item.color} hover:text-white
              transition-all duration-200 ease-out
              ${AddIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
            style={{
              transitionDelay: AddIsOpen ? `${index * 50}ms` : "0ms",
            }}
          >
            <div
              className={`flex items-center justify-center min-w-8 h-8 rounded-lg
                                          bg-gradient-to-br ${item.color}
                                          shadow-md shadow-black/10
                                          group-hover:scale-110 group-hover:shadow-lg
                                          transition-all duration-200`}
            >
              <Image
                src={item.icon}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 brightness-0 invert"
              />
            </div>

            <div className="font-medium text-sm flex flex-row items-center justify-between w-full">
              <span>{t(item.label)}</span>
            </div>

            <svg
              className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
        <div
          onClick={() => {
            toggleCreate();
            setAddIsOpen(false);
          }}
          className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl
              text-studodarkblue dark:text-white
              hover:bg-gradient-to-r hover:from-violet-400 to-purple-500 hover:text-white
              transition-all duration-200 ease-out
              ${AddIsOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
          style={{
            transitionDelay: AddIsOpen ? `${3 * 50}ms` : "0ms",
          }}
        >
          {/* Icon Container */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg
              bg-gradient-to-br from-violet-400 to-purple-500
              shadow-md shadow-black/10
              group-hover:scale-110 group-hover:shadow-lg
              transition-all duration-200`}
          >
            <Image
              width={10}
              height={10}
              src={"/icons/folder.svg"}
              alt=""
              className="h-4 w-4 brightness-0 invert"
            />
          </div>

          {/* Label */}
          <span className="font-medium text-sm">{t("create_f")}</span>

          {/* Hover Arrow */}
          <svg
            className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
