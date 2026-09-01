"use client";
import { useEffect, useRef, useState } from "react";
import classNames from "@studo/utils/classnames";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";
type Variant = "default" | "entity";

interface SimpleMenuProps {
  trigger: React.ReactNode;
  children?: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  width?: string | number;
  clickOutside?: () => void;
  isOpenProp?: boolean;
  side?: Side;
  align?: Align;
  variant?: Variant;
  // trigger de volle breedte van de parent laten vullen i.p.v. w-fit
  fullWidth?: boolean;
}

const sideClasses: Record<Side, string> = {
  bottom: "top-full mt-4 origin-top",
  top: "bottom-full mb-4 origin-bottom",
  right: "left-full ml-4 origin-left",
  left: "right-full mr-4 origin-right",
};

const alignClasses: Record<Side, Record<Align, string>> = {
  bottom: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
  top: { start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0" },
  right: {
    start: "top-0",
    center: "top-1/2 -translate-y-1/2",
    end: "bottom-0",
  },
  left: { start: "top-0", center: "top-1/2 -translate-y-1/2", end: "bottom-0" },
};

const SimpleMenu = (props: SimpleMenuProps) => {
  const {
    trigger,
    children,
    width,
    clickOutside,
    isOpenProp,
    side = "bottom",
    align = "end",
    variant = "default",
    fullWidth = false,
  } = props;
  const [isOpen, setIsopen] = useState<boolean>(isOpenProp ?? false);
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clickOutside) {
        clickOutside();
      }
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
  }, [clickOutside, isOpen]);

  const variantClasses =
    variant === "entity"
      ? "p-3 gap-2 rounded-4xl backdrop-blur-2xl border border-neutral-200/30 bg-studogrey/20"
      : classNames(
          width ? String(width) : "w-55",
          "p-2 rounded-2xl backdrop-blur-xl",
          "bg-white/80 dark:bg-[#1e293b]/90",
          "border border-white/50 dark:border-white/10",
          "shadow-xl shadow-black/10 dark:shadow-black/30",
        );

  return (
    <div
      className={classNames("relative h-fit", fullWidth ? "w-full" : "w-fit")}
      ref={containerRef}
    >
      <div
        onClick={() => {
          const next = !isOpen;
          setIsopen(next);
          if (next) {
            requestAnimationFrame(() => setIsAnimated(true));
          } else {
            setIsAnimated(false);
          }
        }}
      >
        {trigger}
      </div>
      <div
        ref={popupRef}
        className={classNames(
          "absolute z-9999 truncate transition-all duration-300 ease-out",
          sideClasses[side],
          alignClasses[side][align],
          variantClasses,
          isOpen
            ? "opacity-100 scale-100 visible pointer-events-auto"
            : "opacity-0 scale-95 invisible pointer-events-none",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col gap-1">
          {typeof children === "function" ? children(isAnimated) : children}
        </div>
      </div>
    </div>
  );
};

SimpleMenu.displayName = "SimpleMenu";
export default SimpleMenu;
