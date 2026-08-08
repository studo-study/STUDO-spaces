"use client";
import Image from "next/image";
import { ReactNode } from "react";

const IconLib: Record<string, string> = {
  default: "/vectors/workplace.png",
  archive: "/vectors/archive.png",
  folders: "/vectors/folders.png",
  boxes: "/vectors/empty_box.png",
};

interface EmptyFallbackProps {
  title?: string;
  message?: string;
  cta?: ReactNode;
  icon?: "default" | "archive" | "folders" | "boxes";
}
const EmptyFallback: React.FC<EmptyFallbackProps> = (props) => {
  const { title, message, cta, icon = "default" } = props;
  const img = IconLib[icon];
  return (
    <div
      className={
        "min-w-0 min-h-0 flex-1 flex flex-col items-center justify-center gap-4"
      }
    >
      <Image
        src={img}
        alt={"lamp"}
        width={200}
        height={200}
        className={"h-30 w-fit saturate-0 opacity-75"}
      />

      <div className={"flex flex-col items-center justify-center gap-2"}>
        <span className={"dark:text-white text-2xl font-bold"}>{title}</span>
        <p className={"dark:text-studogrey text-gray-400 text-sm"}>{message}</p>
        <div className={"max-h-8 h-8 mt-3"}>{cta}</div>
      </div>
    </div>
  );
};

EmptyFallback.displayName = "EmptyFallback";
export default EmptyFallback;
