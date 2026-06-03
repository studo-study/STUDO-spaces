"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { TabSwitcherProps } from "@/components/ui/design_system/tabswitcher/TabSwitcher.types";

const SIZE_STYLES = {
  sm: {
    button: "px-3 py-1 text-xs",
    padding: "p-0.5",
    inset: "top-0.5 bottom-0.5",
  },
  md: {
    button: "px-5 py-2 text-sm",
    padding: "p-1",
    inset: "top-1 bottom-1",
  },
  lg: {
    button: "px-6 py-2.5 text-base",
    padding: "p-1",
    inset: "top-1 bottom-1",
  },
  xl: {
    button: "px-8 py-3 text-lg",
    padding: "p-1.5",
    inset: "top-1.5 bottom-1.5",
  },
} as const;

export const TabSwitcher = <T extends string = string>({
  tabs,
  value,
  onChange,
  size = "md",
}: TabSwitcherProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const hasAnimated = useRef(false);

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

  useLayoutEffect(() => {
    if (indicator && !hasAnimated.current) {
      requestAnimationFrame(() => {
        hasAnimated.current = true;
      });
    }
  }, [indicator]);

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className={`relative flex gap-1 bg-studogrey/30 border border-studoborder/30 rounded-full ${styles.padding}`}
      >
        {indicator && (
          <div
            className={`absolute bg-studogrey rounded-full shadow ease-out ${styles.inset}`}
            style={{
              left: `${indicator.left}px`,
              width: `${indicator.width}px`,
              // eslint-disable-next-line react-hooks/refs
              transition: hasAnimated.current
                ? "left 300ms ease-out, width 300ms ease-out"
                : "none",
            }}
          />
        )}

        {tabs.map((t) => (
          <button
            key={t.key}
            ref={(el) => {
              buttonRefs.current[t.key] = el;
            }}
            type={"button"}
            onClick={() => onChange(t.key)}
            className={`relative z-10 flex truncate items-center gap-1 rounded-full font-bold transition-colors duration-300 cursor-pointer ${styles.button} ${
              value === t.key
                ? "dark:text-white text-studodarkblue"
                : "text-studodarkblue/50 dark:text-studogrey hover:text-zinc-400"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};
