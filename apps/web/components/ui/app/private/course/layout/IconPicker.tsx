"use client";
import { useState, useRef, useEffect } from "react";
import {
  FiBook,
  FiCode,
  FiStar,
  FiFolder,
  FiBriefcase,
  FiCpu,
  FiGlobe,
  FiHeart,
  FiMusic,
  FiCamera,
  FiFeather,
  FiAward,
  FiZap,
  FiSun,
  FiMoon,
  FiCompass,
  FiAnchor,
  FiTarget,
  FiTrendingUp,
  FiLayers,
  FiPenTool,
  FiTerminal,
  FiDatabase,
  FiGrid,
  FiPackage,
  FiClipboard,
  FiBookOpen,
  FiEdit3,
  FiFlag,
  FiGitBranch,
  FiActivity,
  FiSmile,
  FiCoffee,
  FiDroplet,
  FiWind,
  FiPercent,
  FiBarChart2,
  FiPieChart,
  FiThermometer,
  FiScissors,
  FiEyeOff,
  FiEye,
  FiMessageCircle,
  FiType,
  FiShield,
  FiLock,
  FiSliders,
  FiUsers,
  FiSettings,
  FiImage,
  FiFilm,
  FiHeadphones,
  FiMap,
  FiTruck,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { CiViewTable } from "react-icons/ci";
import { useTranslations } from "next-intl";

export const ICONS: Record<string, IconType> = {
  default: CiViewTable,
  book: FiBook,
  code: FiCode,
  star: FiStar,
  folder: FiFolder,
  briefcase: FiBriefcase,
  cpu: FiCpu,
  globe: FiGlobe,
  heart: FiHeart,
  music: FiMusic,
  camera: FiCamera,
  feather: FiFeather,
  award: FiAward,
  zap: FiZap,
  sun: FiSun,
  moon: FiMoon,
  compass: FiCompass,
  anchor: FiAnchor,
  target: FiTarget,
  trending: FiTrendingUp,
  layers: FiLayers,
  pen: FiPenTool,
  terminal: FiTerminal,
  database: FiDatabase,
  grid: FiGrid,
  package: FiPackage,
  clipboard: FiClipboard,
  bookopen: FiBookOpen,
  edit: FiEdit3,
  flag: FiFlag,
  git: FiGitBranch,
  activity: FiActivity,
  smile: FiSmile,
  coffee: FiCoffee,
  droplet: FiDroplet,
  wind: FiWind,
};

export const COURSES: Record<string, IconType> = {
  ...ICONS,
  // extra course-specifieke iconen
  percent: FiPercent,
  barchart: FiBarChart2,
  piechart: FiPieChart,
  thermometer: FiThermometer,
  scissors: FiScissors,
  eyeoff: FiEyeOff,
  eye: FiEye,
  messagecircle: FiMessageCircle,
  type: FiType,
  shield: FiShield,
  lock: FiLock,
  scale: FiSliders,
  users: FiUsers,
  settings: FiSettings,
  image: FiImage,
  film: FiFilm,
  headphones: FiHeadphones,
  map: FiMap,
  truck: FiTruck,
};

interface FlowColor {
  name: string;
  bg: string;
  text: string;
  dot: string;
  ring: string;
}

export const COLORS: FlowColor[] = [
  {
    name: "emerald",
    bg: "bg-emerald-400/20",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500",
  },
  {
    name: "blue",
    bg: "bg-blue-400/20",
    text: "text-blue-500",
    dot: "bg-blue-500",
    ring: "ring-blue-500",
  },
  {
    name: "violet",
    bg: "bg-violet-400/20",
    text: "text-violet-500",
    dot: "bg-violet-500",
    ring: "ring-violet-500",
  },
  {
    name: "rose",
    bg: "bg-rose-400/20",
    text: "text-rose-500",
    dot: "bg-rose-500",
    ring: "ring-rose-500",
  },
  {
    name: "amber",
    bg: "bg-amber-400/20",
    text: "text-amber-500",
    dot: "bg-amber-500",
    ring: "ring-amber-500",
  },
  {
    name: "cyan",
    bg: "bg-cyan-400/20",
    text: "text-cyan-500",
    dot: "bg-cyan-500",
    ring: "ring-cyan-500",
  },
  {
    name: "orange",
    bg: "bg-orange-400/20",
    text: "text-orange-500",
    dot: "bg-orange-500",
    ring: "ring-orange-500",
  },
  {
    name: "pink",
    bg: "bg-pink-400/20",
    text: "text-pink-500",
    dot: "bg-pink-500",
    ring: "ring-pink-500",
  },
];

interface IconPickerProps {
  value?: string;
  setValue?: (value: string) => void;
  onChange?: (value: string) => void;
  course?: boolean;
}

const IconPicker = ({ value, onChange, course }: IconPickerProps) => {
  const resolvedValue = value ?? (course ? "blue:bookopen" : "emerald:default");
  const t = useTranslations("iconPicker");
  const { color: selectedColor, icon: selectedIcon } =
    parseFlowIcon(resolvedValue);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const color = COLORS.find((c) => c.name === selectedColor) ?? COLORS[0];
  const CurrentIcon = course
    ? COURSES[selectedIcon]
    : (ICONS[selectedIcon] ?? CiViewTable);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) searchRef.current.focus();
  }, [isOpen]);

  const filtered = course
    ? Object.entries(COURSES).filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase()),
      )
    : Object.entries(ICONS).filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase()),
      );

  return (
    <div ref={popupRef} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center transition-all hover:scale-105 active:scale-95`}
      >
        <CurrentIcon size={20} />
      </button>

      {/* popup */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-12 left-0 z-[9999] w-[340px] rounded-2xl
                    bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                    border border-white/50 dark:border-white/10
                    shadow-xl shadow-black/10 dark:shadow-black/30
                    transition-all duration-300 ease-out origin-top
                    ${
                      isOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-5 pointer-events-none"
                    }`}
      >
        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <input
            ref={searchRef}
            type="text"
            placeholder="Zoeken..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-xl
                            bg-white/60 dark:bg-white/5
                            border border-white/50 dark:border-white/10
                            focus:outline-none placeholder:text-neutral-400
                            dark:text-white"
          />
        </div>

        {/* Colors */}
        <div className="flex gap-2 px-4 pb-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(toFlowIcon(c.name, selectedIcon));
              }}
              className={`w-6 h-6 rounded-full ${c.dot} transition-all hover:scale-110 ${
                c.name === selectedColor ? `ring-2 ring-offset-2 ${c.ring}` : ""
              }`}
            />
          ))}
        </div>

        {/* Icon grid */}
        <div className="px-4 pb-4 max-h-[240px] overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-7 gap-1">
              {filtered.map(([name, Icon]) => (
                <button
                  key={name}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange?.(toFlowIcon(selectedColor, name));
                    setIsOpen(false);
                  }}
                  className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all ${
                    name === selectedIcon
                      ? `${color.bg} ${color.text}`
                      : "hover:bg-white/40 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-neutral-400 py-6">
              {t("no_icons_found")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

IconPicker.displayName = "IconPicker";
export default IconPicker;

export function parseFlowIcon(value: string): { color: string; icon: string } {
  const [color, icon] = value.split(":");
  return { color: color ?? "emerald", icon: icon ?? "book" };
}

export function toFlowIcon(color: string, icon: string): string {
  return `${color}:${icon}`;
}
