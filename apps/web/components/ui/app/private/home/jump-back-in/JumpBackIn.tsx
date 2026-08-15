"use client";
import SectionHeader from "@studo/ui/design_system/section/SectionHeader";
import { useTranslations } from "next-intl";
import { MdReplay } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import LastTenItem from "@/components/ui/app/private/home/jump-back-in/LastTenItem";
import { useSets } from "@/hooks/app/sets/useSets";
import { LastStudied } from "@studo/types";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import classNames from "@/utils/classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";

const JumpBackIn = () => {
  const { lastTen } = useSets();
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    atStart: true,
    atEnd: false,
    activeIndex: 0,
  });

  const items: LastStudied[] = lastTen.slice(0, 3);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = container;
      const atStart = scrollLeft <= 1;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      if (atEnd) {
        setScrollState({
          atStart,
          atEnd,
          activeIndex: Array.from(container.children).length - 1,
        });
        return;
      }

      let closest = Infinity;
      let activeIndex = 0;
      Array.from(container.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const distance = Math.abs(el.offsetLeft - scrollLeft);
        if (distance < closest) {
          closest = distance;
          activeIndex = i;
        }
      });

      setScrollState({ atStart, atEnd, activeIndex });
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  const { atStart, atEnd, activeIndex } = scrollState;
  const lastIndex = items.length - 1;

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    const item = container?.children[index] as HTMLElement | undefined;
    if (!container || !item) return;
    const centerOffset =
      item.offsetLeft - (container.clientWidth - item.clientWidth) / 2;
    container.scrollTo({ left: centerOffset, behavior: "smooth" });
  };

  const handleForward = () =>
    scrollToIndex(atEnd ? 0 : Math.min(activeIndex + 1, lastIndex));
  const handleBackward = () =>
    scrollToIndex(atStart ? lastIndex : Math.max(activeIndex - 1, 0));

  return (
    <AnimateOnMount delay={0}>
      <section className="flex flex-col gap-5">
        <SectionHeader
          sectionIcon={<MdReplay />}
          title={t("jump-back-in_title")}
        />

        <div className="relative w-full h-50">
          {/* Left fade + arrow */}
          <div
            className={classNames(
              "absolute inset-y-0 left-0 z-10 flex items-center transition-opacity duration-300",
              atStart ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-bg-white dark:from-slate-800 to-transparent" />
            <button
              onClick={handleBackward}
              aria-label={t("jump-back-in_previous")}
              className="relative z-10 ml-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-studoborder shadow-sm cursor-pointer active:scale-95 transition-transform duration-150 dark:text-white text-studodarkblue"
            >
              <ChevronLeft size={15} />
            </button>
          </div>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="w-full h-full flex flex-row gap-5 overflow-x-scroll scroll-hidden snap-x snap-mandatory"
          >
            {items.map((item, i) => (
              <div key={i} className="snap-center shrink-0">
                <LastTenItem data={item} />
              </div>
            ))}
          </div>

          {/* Right fade + arrow */}
          <div
            className={classNames(
              "absolute inset-y-0 right-0 z-10 flex items-center transition-opacity duration-300",
              atEnd ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-bg-white dark:from-slate-800 to-transparent" />
            <button
              onClick={handleForward}
              aria-label={t("jump-back-in_next")}
              className="relative z-10 mr-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-studoborder shadow-sm cursor-pointer active:scale-95 transition-transform duration-150 dark:text-white text-studodarkblue"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {items.length > 1 && (
          <div className="w-full flex items-center justify-center gap-3">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={t("jump-back-in_goto", { index: i + 1 })}
                className={classNames(
                  "h-2 rounded-full cursor-pointer transition-all duration-300",
                  activeIndex === i ? "bg-studoblue w-6" : "w-2 bg-studoborder",
                )}
              />
            ))}
          </div>
        )}
      </section>
    </AnimateOnMount>
  );
};

export default JumpBackIn;
