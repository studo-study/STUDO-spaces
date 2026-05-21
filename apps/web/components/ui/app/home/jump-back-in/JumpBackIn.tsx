"use client";
import SectionHeader from "@/components/ui/design_system/section/SectionHeader";
import { useTranslations } from "next-intl";
import { MdReplay } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import LastTenItem from "@/components/ui/app/home/jump-back-in/LastTenItem";
import { useSets } from "@/hooks/app/sets/useSets";
import { LastStudied } from "@studo/types";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";

const ARROW_BASE =
  "absolute z-20 top-1/2 -translate-y-1/2 h-7 w-7 flex justify-center items-center " +
  "rounded-full border border-studoborder bg-studogrey/30 cursor-pointer " +
  "active:scale-95 transition-all duration-300 dark:text-white text-studodarkblue";

const FADE_BASE =
  "absolute z-10 h-full w-8 pointer-events-none to-transparent " +
  "dark:from-bg-dark from-bg-white";

const JumpBackIn = () => {
  const { sets, visualsets } = useSets();
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    atStart: true,
    atEnd: false,
    activeIndex: 0,
  });

  const items: LastStudied[] = [
    ...sets
      .filter((s) => s.last_studied)
      .map((s) => ({
        set_id: s.id,
        last_studied: s.last_studied!,
        title: s.title,
        Course: s.course,
        type: "studyset" as const,
        progress: s.progress ?? 0,
        length: s.card_count ?? 0,
      })),
    ...visualsets
      .filter((vs) => vs.last_studied)
      .map((vs) => ({
        set_id: vs.id,
        last_studied: vs.last_studied!,
        title: vs.title,
        Course: vs.course,
        type: "visualset" as const,
        progress: vs.progress ?? 0,
        length: vs.pin_count ?? 0,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.last_studied).getTime() - new Date(a.last_studied).getTime(),
    )
    .slice(0, 3);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollLeft, clientWidth, scrollWidth } = container;
      const atStart = scrollLeft <= 1;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      let activeIndex = 0;
      let closest = Infinity;
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
    container.scrollTo({ left: item.offsetLeft, behavior: "smooth" });
  };

  const handleForward = () =>
    scrollToIndex(atEnd ? 0 : Math.min(activeIndex + 1, lastIndex));
  const handleBackward = () =>
    scrollToIndex(atStart ? lastIndex : Math.max(activeIndex - 1, 0));

  return (
    <AnimateOnMount delay={0}>
      <section className="flex flex-col gap-5 overflow-visible">
        <SectionHeader
          sectionIcon={<MdReplay />}
          title={t("jump-back-in_title")}
        />

        <div className="relative w-full h-50 flex flex-row gap-2 overflow-visible">
          {!atStart && (
            <>
              <div className={`${FADE_BASE} left-0 bg-linear-90`} />
              <button
                onClick={handleBackward}
                aria-label={t("jump-back-in_previous")}
                className={`${ARROW_BASE} left-3`}
              >
                <IoChevronBack />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="relative w-full h-full flex flex-row gap-5 overflow-x-scroll overflow-y-visible scroll-hidden"
          >
            {items.map((item, i) => (
              <LastTenItem data={item} key={i} />
            ))}
          </div>

          {!atEnd && (
            <>
              <button
                onClick={handleForward}
                aria-label={t("jump-back-in_next")}
                className={`${ARROW_BASE} right-3`}
              >
                <IoChevronForward />
              </button>
              <div className={`${FADE_BASE} right-0 bg-linear-270`} />
            </>
          )}
        </div>

        {items.length > 1 && (
          <div className="w-full flex items-center justify-center gap-3">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={t("jump-back-in_goto", { index: i + 1 })}
                className={`w-2.5 h-2.5 rounded-full border border-studoborder cursor-pointer transition-colors ${
                  activeIndex === i ? "bg-studoblue" : ""
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </AnimateOnMount>
  );
};

export default JumpBackIn;
