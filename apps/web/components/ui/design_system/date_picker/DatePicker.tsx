"use client";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

type DatePickerProps = {
  /** geselecteerde datum (controlled) */
  value?: Date | null;
  /** callback met de gekozen datum */
  onChange?: (date: Date) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** uitlijning van het kalenderpaneel t.o.v. de trigger */
  align?: "start" | "end";
  /** vroegste selecteerbare datum (inclusief) */
  min?: Date;
  /** laatste selecteerbare datum (inclusief) */
  max?: Date;
  variant: "default" | "ghost";
  iconColor?: string;
};

const variantMap = {
  default:
    "w-full rounded-full flex gap-2 flex-row cursor-pointer items-center justify-between outline-none ring-0 border bg-studogrey/30 text-left disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "flex flex-row gap-2 items-center min-w-fit w-full text-left cursor-pointer justify-between",
};
const sizeMap = {
  xs: {
    trigger: "px-1.5 py-0.5 text-xs gap-2",
    icon: 12,
    label: "text-xs px-2",
  },
  sm: { trigger: "px-3 py-1.5 text-sm", icon: 14, label: "text-xs px-2" },
  md: { trigger: "px-4 py-2 text-base", icon: 16, label: "text-xs px-2" },
  lg: { trigger: "px-5 py-3 text-base", icon: 18, label: "text-sm px-3" },
  xl: { trigger: "px-6 py-4 text-lg", icon: 20, label: "text-sm px-3" },
} as const;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** maandag-eerste index (0 = maandag … 6 = zondag) */
const mondayIndex = (day: number) => (day + 6) % 7;

const DatePicker = ({
  value,
  onChange,
  placeholder,
  label,
  variant = "default",
  error,
  id,
  disabled,
  size = "lg",
  align = "start",
  min,
  max,
  iconColor,
}: DatePickerProps) => {
  const locale = useLocale();
  const t = useTranslations("datepicker");
  const s = sizeMap[size];

  const style = variantMap[variant];
  const [open, setOpen] = React.useState(false);
  // welke maand is zichtbaar in het paneel
  const [viewDate, setViewDate] = React.useState<Date>(
    startOfDay(value ?? new Date()),
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // paneel opent altijd op de maand van de huidige waarde
  React.useEffect(() => {
    if (open) setViewDate(startOfDay(value ?? new Date()));
  }, [open, value]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const triggerFmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  const monthFmt = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );

  // weekdag-labels (maandag-eerst), afgeleid van de locale
  const weekdays = React.useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 2024-01-01 is een maandag
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 1 + i)),
    );
  }, [locale]);

  const isDisabledDay = React.useCallback(
    (d: Date) => {
      if (min && d < startOfDay(min)) return true;
      if (max && d > startOfDay(max)) return true;
      return false;
    },
    [min, max],
  );

  const cells = React.useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const leading = mondayIndex(firstOfMonth.getDay());
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const out: (Date | null)[] = [];
    for (let i = 0; i < leading; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    return out;
  }, [viewDate]);

  const today = startOfDay(new Date());

  const handleSelect = (d: Date) => {
    if (isDisabledDay(d)) return;
    // lokale 12:00 → voorkomt off-by-one bij toISOString() in tijdzones vóór UTC
    onChange?.(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12));
    setOpen(false);
  };

  const goMonth = (delta: number) =>
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );

  return (
    <div ref={containerRef} className={"relative min-w-fit"}>
      {label && (
        <label htmlFor={id} className={`text-zinc-400 ${s.label}`}>
          {label}
        </label>
      )}

      <button
        type={"button"}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex flex-row gap-2 items-center cursor-pointer ${
          error ? "border-red-500" : "border-studoborder/30"
        } ${s.trigger}`}
      >
        <Calendar
          size={s.icon}
          className={iconColor}
          opacity={!iconColor ? 0.5 : 1}
        />
        <span className={value ? "" : "text-zinc-400"}>
          {value ? triggerFmt.format(value) : (placeholder ?? t("placeholder"))}
        </span>
      </button>

      {error && (
        <span className={`text-red-500 ${s.label} block mt-1`}>{error}</span>
      )}

      <div
        className={`absolute z-9999 top-full mt-2 w-max
          ${align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left"}
          p-3 border border-studoborder/30
          rounded-2xl dark:bg-slate-800 bg-slate-100
          flex flex-col gap-3
          shadow-xl shadow-black/10 dark:shadow-black/30
          transition-all duration-300 ease-out
          ${
            open
              ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* maand-navigatie */}
        <div className={"w-full flex flex-row items-center justify-between"}>
          <button
            type={"button"}
            onClick={() => goMonth(-1)}
            className={
              "p-1 rounded-full cursor-pointer hover:dark:bg-zinc-400/20 hover:bg-zinc-200/50"
            }
          >
            <ChevronLeft size={16} opacity={0.6} />
          </button>
          <span className={"text-sm font-semibold capitalize"}>
            {monthFmt.format(viewDate)}
          </span>
          <button
            type={"button"}
            onClick={() => goMonth(1)}
            className={
              "p-1 rounded-full cursor-pointer hover:dark:bg-zinc-400/20 hover:bg-zinc-200/50"
            }
          >
            <ChevronRight size={16} opacity={0.6} />
          </button>
        </div>

        {/* weekdag-headers */}
        <div className={"grid grid-cols-7 gap-1"}>
          {weekdays.map((w) => (
            <span
              key={w}
              className={
                "text-[11px] text-zinc-400 text-center capitalize select-none"
              }
            >
              {w}
            </span>
          ))}
        </div>

        {/* dagen */}
        <div className={"grid grid-cols-7 gap-1"}>
          {cells.map((d, i) => {
            if (!d) return <span key={`e-${i}`} />;
            const isSelected = value ? sameDay(d, value) : false;
            const isToday = sameDay(d, today);
            const disabledDay = isDisabledDay(d);
            return (
              <button
                key={d.toISOString()}
                type={"button"}
                disabled={disabledDay}
                onClick={() => handleSelect(d)}
                className={`w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors cursor-pointer
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "hover:dark:bg-zinc-400/20 hover:bg-zinc-200/50"
                  }
                  ${!isSelected && isToday ? "border border-studoborder" : ""}
                `}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

DatePicker.displayName = "DatePicker";

export default DatePicker;
