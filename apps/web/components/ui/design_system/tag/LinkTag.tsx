import { useState, useRef, useEffect, ReactNode } from "react";

interface LinkOption {
    value: string;
    label: string;
    icon?: ReactNode;
}

interface LinkTagProps {
    label: string;
    icon?: ReactNode;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    options?: LinkOption[];
}

const LinkTag = ({
                     label,
                     icon,
                     value,
                     onChange,
                     placeholder,
                     options,
                 }: LinkTagProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setInputValue(value ?? "");
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onChange(inputValue.trim());
        }
        setIsOpen(false);
    };

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`flex items-center gap-1.5 px-3 text-sm py-0.5 rounded-full text-sm font-medium
         text-studodarkblue border border-studoborder/30 dark:text-neutral-200
          hover:bg-white/10 transition-all cursor-pointer select-none
        `}
            >
                {icon && (
                    <span className="text-neutral-400 shrink-0">{icon}</span>
                )}
                <span className="truncate">{label}</span>
            </button>

            <div
                onClick={(e) => e.stopPropagation()}
                className={`
          absolute top-full left-0 mt-2 z-[9999] min-w-[240px] rounded-xl
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
                {/* Link input */}
                <div className="p-2">
                    <input
                        ref={inputRef}
                        type="url"
                        value={inputValue}
                        placeholder={placeholder ?? "https://..."}
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

                {/* Optionele preset links */}
                {options && options.length > 0 && (
                    <>
                        <div className="border-t border-white/10 mx-2" />
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
                                    {option.icon && (
                                        <span className="shrink-0">{option.icon}</span>
                                    )}
                                    <span className="truncate">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

LinkTag.displayName = "LinkTag";
export default LinkTag;