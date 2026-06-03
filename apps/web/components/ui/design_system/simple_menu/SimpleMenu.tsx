"use client";
import { useEffect, useRef, useState } from "react";

interface SimpleMenuProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  width?: string | number;
}

const SimpleMenu = (props: SimpleMenuProps) => {
  const { trigger, children, width } = props;
  const [isOpen, setIsopen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsopen(false);
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={"relative w-fit h-fit"} ref={containerRef}>
      <div onClick={() => setIsopen((prev) => !prev)}>{trigger}</div>
      <div
        ref={popupRef}
        className={`absolute top-full right-0 mt-4
        z-9999 ${width ? width : "w-55"} p-2 truncate
        rounded-2xl
bg-white/80 dark:bg-[#1e293b]/90
        backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out origin-top
        ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
        }
      `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
};

SimpleMenu.displayName = "SimpleMenu";
export default SimpleMenu;
