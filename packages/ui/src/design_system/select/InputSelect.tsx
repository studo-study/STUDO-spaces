"use client";
import React, { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

type SelectProps = {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  errorOption?: boolean;
  id?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  dataCy?: string;
  title?: string;
  tabIndex?: number;
};

const sizeMap = {
  xs: {
    trigger: "px-1.5 py-0.5 text-xs gap-2",
    chevron: 9,
    item: "p-1.5 text-xs",
    label: "text-xs px-2",
  },
  sm: {
    trigger: "px-3 py-1.5 text-sm gap-3",
    chevron: 12,
    item: "p-1.5 text-xs",
    label: "text-xs px-2",
  },
  md: {
    trigger: "px-4 py-2 text-base gap-4",
    chevron: 14,
    item: "p-2 text-sm",
    label: "text-xs px-2",
  },
  lg: {
    trigger: "h-10 px-5 text-sm gap-5",
    chevron: 14,
    item: "p-2 text-sm",
    label: "text-sm px-3",
  },
  xl: {
    trigger: "px-6 py-4 text-lg gap-5",
    chevron: 16,
    item: "p-3 text-base",
    label: "text-sm px-3",
  },
} as const;

const InputSelect = ({
  options,
  value,
  onChange,
  placeholder = "Selecteer een optie",
  label,
  id,
  disabled,
  size = "lg",
  dataCy,
  title,
  tabIndex,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((o) => String(o.value) === String(value));
  const s = sizeMap[size];

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

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    setOpen(false);
  };

  const t = useTranslations("select");

  return (
    <div title={title} ref={containerRef} className={"relative"}>
      {label && (
        <label htmlFor={id} className={`text-zinc-400 ${s.label}`}>
          {label}
        </label>
      )}
      <button
        type={"button"}
        id={id}
        disabled={disabled}
        data-cy={dataCy}
        tabIndex={tabIndex}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full flex flex-row items-center justify-between cursor-pointer rounded-4xl glass-rgb border border-studoborder/30 shadow-2xl text-studodarkblue dark:text-white text-left transition-all duration-300 outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed ${s.trigger}`}
      >
        <div className={"flex flex-row gap-2 items-center"}>
          {selected && selected.icon}
          <span className={selected ? "" : "text-zinc-400"}>
            {selected ? selected.label : placeholder}
          </span>
        </div>
        <FaChevronDown
          size={s.chevron}
          opacity={0.5}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-0 right-0 top-full mt-2
          z-9999 p-3 border border-studoborder/30
          rounded-2xl backdrop-blur-2xl min-w-30
          glass-rgb gap-2 flex flex-col h-fit
          shadow-xl shadow-black/10 dark:shadow-black/30
          transition-all duration-300 ease-out origin-top
          ${
            open
              ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"w-full flex flex-col gap-1"}>
          <span className={`w-full text-zinc-400 ${s.label}`}>
            {label ?? t("options")}
          </span>
          <div
            className={
              "w-full h-fit flex flex-col max-h-60 scroll-hidden overflow-y-auto"
            }
          >
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <button
                  key={String(option.value)}
                  type={"button"}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full hover:dark:bg-zinc-400/20 hover:bg-zinc-200/50 rounded-lg flex flex-row items-center justify-between cursor-pointer ${
                    s.item
                  } ${isSelected ? "dark:bg-zinc-400/20 bg-zinc-200/50" : ""}`}
                >
                  <span className={"flex flex-row gap-2 items-center truncate"}>
                    {option.icon} {option.label}
                  </span>
                  {isSelected && (
                    <span className={"text-xs text-zinc-500"}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

InputSelect.displayName = "InputSelect";

export default InputSelect;
