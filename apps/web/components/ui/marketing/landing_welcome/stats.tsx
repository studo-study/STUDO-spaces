// components/landing_welcome/sets.tsx
import { FiTool } from "react-icons/fi";
import { TbFreeRights } from "react-icons/tb";
import { IoMdInfinite } from "react-icons/io";
import { useTranslations } from "next-intl";
import AnimateOnScroll from "@/components/ui/overige/ui/AnimateOnScroll";

export default function Stats() {
  const t = useTranslations("landing.welcome");

  const stats = [
    { icon: FiTool, label: t("stat1") },
    { icon: IoMdInfinite, label: t("stat2") },
    { icon: TbFreeRights, label: t("stat3") },
  ];

  return (
    <AnimateOnScroll>
      <section className="w-full max-w-screen flex justify-center items-center md:px-20 lg:mb-20">
        <ul className="flex flex-col md:flex-row items-center justify-center gap-4 w-fit md:min-w-[40%] rounded-3xl md:rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 dark:bg-none dark:glass-rgb border border-studoborder/20 py-4 px-6 md:px-8 shadow-lg list-none">
          {stats.map((stat, index) => (
            <li key={index} className="contents">
              <div className="flex flex-col items-center justify-center text-white text-center gap-2 md:gap-1 px-3">
                <stat.icon
                  className="text-3xl md:text-4xl"
                  aria-hidden="true"
                />
                <span className="font-bold text-lg md:text-xl">
                  {stat.label}
                </span>
              </div>
              {index < stats.length - 1 && (
                <div
                  className="hidden md:block h-12 border-l-2 border-white mx-4"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ul>
      </section>
    </AnimateOnScroll>
  );
}
