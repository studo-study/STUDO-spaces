import { useState, useRef, useEffect, ReactNode } from "react";

interface TagOption {
    value: string;
    label: string;
    icon?: ReactNode;
    dot?: string; // tailwind color class for a dot, e.g. "bg-amber-400"
}

interface TagSelectorProps {
    label: string;
    icon?: ReactNode;
    options: TagOption[];
    value: string;
    onChange: (value: string) => void;
    dot?: string;
}

const TagSelector = ({ label, icon, options, value, onChange, dot }: TagSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);
    const displayLabel = selected?.label ?? label;
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

    return (
        <div ref={ref} className="relative inline-block">
            {/* Pill trigger */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                    border border-white/10 dark:border-white/10
                    bg-white/5 dark:bg-white/5
                    text-neutral-700 dark:text-neutral-200
                    hover:bg-white/10 dark:hover:bg-white/10
                    transition-all cursor-pointer select-none
                `}
            >
                {displayDot && (
                    <span className={`w-2.5 h-2.5 rounded-full ${displayDot} shrink-0`} />
                )}
                {displayIcon && (
                    <span className="text-neutral-400 dark:text-neutral-400 shrink-0">
                        {displayIcon}
                    </span>
                )}
                <span className="truncate">{displayLabel}</span>
            </button>

            {/* Dropdown */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    absolute top-full left-0 mt-2 z-[9999] min-w-[180px] rounded-xl
                    bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                    border border-white/50 dark:border-white/10
                    shadow-xl shadow-black/10 dark:shadow-black/30
                    transition-all duration-200 ease-out origin-top
                    ${isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
                `}
            >
                <div className="py-1.5">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-2 px-3 py-2 text-sm
                                transition-colors cursor-pointer
                                ${option.value === value
                                ? "bg-white/20 dark:bg-white/10 text-neutral-900 dark:text-white"
                                : "text-neutral-600 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/5"
                            }
                            `}
                        >
                            {option.dot && (
                                <span className={`w-2.5 h-2.5 rounded-full ${option.dot} shrink-0`} />
                            )}
                            {option.icon && (
                                <span className="shrink-0">{option.icon}</span>
                            )}
                            <span className="truncate">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

TagSelector.displayName = "TagSelector";
export default TagSelector;