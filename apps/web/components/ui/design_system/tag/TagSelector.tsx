import { useState, useRef, useEffect, useLayoutEffect, ReactNode } from "react";

interface TagOption {
  value: string;
  label: string;
  icon?: ReactNode;
  dot?: string;
}

interface TagSelectorBaseProps {
  label?: string;
  icon?: ReactNode;
  options?: TagOption[];
  dot?: string;
  freeInput?: boolean;
  datePicker?: boolean;
  placeholder?: string;
  error?: string;
  link?: boolean;
  subtle?: boolean;
}

interface SingleSelectProps extends TagSelectorBaseProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultiSelectProps extends TagSelectorBaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

type TagSelectorProps = SingleSelectProps | MultiSelectProps;

const TagSelector = ({
  label,
  icon,
  options,
  value,
  onChange,
  dot,
  subtle = false,
  freeInput = false,
  datePicker = false,
  multiple = false,
  placeholder,
  error,
  link,
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : [value].filter(Boolean)
    : [];
  const selected = !multiple ? options?.find((o) => o.value === value) : null;

  const getDisplayLabel = () => {
    if (datePicker && value) {
      return new Date(value as string).toLocaleDateString();
    }

    if (multiple) {
      if (selectedValues.length === 0) return label;
      const selectedLabels = selectedValues
        .map((v) => options?.find((o) => o.value === v)?.label)
        .filter(Boolean);
      return selectedLabels.join(", ");
    }

    if (link) return label;

    return (selected?.label ?? (value as string)) || label;
  };

  const displayIcon = selected?.icon ?? icon;
  const displayDot = selected?.dot ?? dot;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useLayoutEffect(() => {
    if (isOpen && freeInput && inputRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(value as string);
      inputRef.current.focus();
    }
  }, [isOpen, freeInput, value]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      (onChange as (value: string) => void)(inputValue.trim());
    }
    setIsOpen(false);
  };

  const handleMultiToggle = (optionValue: string) => {
    const cb = onChange as (value: string[]) => void;

    if (selectedValues.includes(optionValue)) {
      cb(selectedValues.filter((v) => v !== optionValue));
    } else {
      cb([...selectedValues, optionValue]);
    }
  };

  const triggerClass = `
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all cursor-pointer select-none
        ${error ? "border-rose-500" : "border-white/10 dark:border-white/10"}
        ${
          subtle
            ? `
                bg-transparent border-transparent
                text-neutral-600 dark:text-neutral-300
                hover:bg-white/10 dark:hover:bg-white/5
            `
            : `
                bg-white/5 dark:bg-white/5
                text-neutral-700 dark:text-neutral-200
                border
                hover:bg-white/10 dark:hover:bg-white/10
            `
        }
    `;

  const dropdownClass = `
        absolute top-full left-0 mt-2 z-[9999] min-w-[180px] rounded-xl
        bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
        border border-white/50 dark:border-white/10
        shadow-xl shadow-black/10 dark:shadow-black/30
        transition-all duration-200 ease-out origin-top
        ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }
    `;

  if (datePicker) {
    return (
      <div ref={ref} className="relative inline-block">
        <button
          type="button"
          onClick={() => dateRef.current?.showPicker?.()}
          className={triggerClass}
        >
          {displayIcon && (
            <span className="text-neutral-400">{displayIcon}</span>
          )}
          {label && <span className="truncate">{getDisplayLabel()}</span>}
        </button>

        <input
          ref={dateRef}
          type="date"
          value={value as string}
          onChange={(e) =>
            (onChange as (value: string) => void)(e.target.value)
          }
          className="sr-only"
          tabIndex={-1}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={triggerClass}
      >
        {displayDot && (
          <span className={`w-2.5 h-2.5 rounded-full ${displayDot} shrink-0`} />
        )}

        {displayIcon && (
          <span className="text-neutral-400 shrink-0">{displayIcon}</span>
        )}

        {label && <span className="truncate">{getDisplayLabel()}</span>}
      </button>

      <div onClick={(e) => e.stopPropagation()} className={dropdownClass}>
        {freeInput ? (
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              placeholder={placeholder ?? label}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") setIsOpen(false);
              }}
              className="w-full px-3 py-1.5 text-sm rounded-lg
                                bg-white/60 dark:bg-white/5
                                border border-white/50 dark:border-white/10
                                focus:outline-none placeholder:text-neutral-400
                                dark:text-white"
            />
          </div>
        ) : (
          <div className="py-1.5">
            {options?.map((option) => {
              const isSelected = multiple
                ? selectedValues.includes(option.value)
                : option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (multiple) {
                      handleMultiToggle(option.value);
                    } else {
                      (onChange as (value: string) => void)(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={`
                                        w-full flex items-center gap-2 px-3 py-2 text-sm
                                        transition-colors cursor-pointer
                                        ${
                                          isSelected
                                            ? "bg-white/20 dark:bg-white/10 text-neutral-900 dark:text-white"
                                            : "text-neutral-600 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/5"
                                        }
                                    `}
                >
                  {multiple && (
                    <span
                      className={`
                                                w-4 h-4 rounded border flex items-center justify-center shrink-0
                                                transition-colors
                                                ${
                                                  isSelected
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "border-neutral-400 dark:border-neutral-500"
                                                }
                                            `}
                    >
                      {isSelected && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M2 5L4 7L8 3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  )}

                  {option.dot && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${option.dot} shrink-0`}
                    />
                  )}

                  {option.icon && (
                    <span className="shrink-0">{option.icon}</span>
                  )}

                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

TagSelector.displayName = "TagSelector";
export default TagSelector;
