"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { SegmentedControlsProps } from "@studo/ui/design_system/segmentedcontrols/SegmentedControls.types";
import { Link } from "@studo/i18n/routing";
import classNames from "@studo/utils/classnames";

const SIZE_STYLES = {
  sm: {
    button: "px-3 py-1 text-xs",
    inset: "top-0.5 bottom-0.5",
  },
  md: {
    button: "px-5 py-2 text-sm",
    inset: "top-1 bottom-1",
  },
  lg: {
    button: "px-6 py-2.5 text-base",
    inset: "top-1 bottom-1",
  },
  xl: {
    button: "px-8 py-3 text-lg",
    inset: "top-1.5 bottom-1.5",
  },
} as const;

export const Tabs = <T extends string = string>({
  tabs,
  value,
  onChange,
  size = "md",
  stretch,
}: SegmentedControlsProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const styles = SIZE_STYLES[size];

  useLayoutEffect(() => {
    const measure = () => {
      const activeBtn = buttonRefs.current[value];
      const container = containerRef.current;
      if (!activeBtn || !container) return;

      setIndicator({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    };

    measure();

    if (document.fonts?.status !== "loaded") {
      document.fonts?.ready.then(measure);
    }

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [value, tabs, size]);

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className={classNames(`relative flex`, stretch && "w-full")}
      >
        {indicator && (
          <div
            className={classNames(
              "absolute bg-studogrey rounded-full shadow ease-out",
              styles.inset,
              stretch && "w-full segmented-controls-stretch",
            )}
          />
        )}

        {tabs.map((t) => {
          const className = classNames(
            `relative z-10 flex truncate items-center justify-center gap-1 rounded-full font-bold transition-colors duration-300 border border-transparent cursor-pointer ${styles.button} ${
              value === t.key
                ? "dark:text-white text-studodarkblue bg-studogrey/30 border-studoborder/30"
                : "text-studodarkblue/50 dark:text-studogrey hover:text-zinc-400"
            }`,
          );
          const onSelect = () => {
            onChange(t.key);
            t.onclick?.();
          };

          if (t.href) {
            return (
              <Link
                key={t.key}
                href={t.href}
                ref={(el) => {
                  buttonRefs.current[t.key] = el;
                }}
                onClick={onSelect}
                className={className}
              >
                {t.icon}
                {t.label}
              </Link>
            );
          }

          return (
            <button
              key={t.key}
              ref={(el) => {
                buttonRefs.current[t.key] = el;
              }}
              type={"button"}
              onClick={onSelect}
              className={className}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
