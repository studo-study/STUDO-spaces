import { SlOptions } from "react-icons/sl";
import { useState, useRef, useEffect, ReactNode } from "react";

interface OptionItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
}

interface ItemOptionsProps {
    options: OptionItem[];
}

const ItemOptions = ({ options }: ItemOptionsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="px-2 py-1 rounded-full hover:bg-studogrey/30 cursor-pointer transition-colors"
            >
                <SlOptions />
            </button>

            <div
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                className={`
                    absolute right-0 top-full mt-1 z-[9999] min-w-[160px] rounded-xl
                    bg-white/80 dark:bg-[#1e293b]/90 backdrop-blur-xl
                    border border-white/50 dark:border-white/10
                    shadow-xl shadow-black/10 dark:shadow-black/30
                    transition-all duration-200 ease-out origin-top-right
                    ${isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
                `}
            >
                <div className="p-1.5">
                    {options.map((option, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                option.onClick();
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-2 px-3 py-2 text-sm
                                transition-colors cursor-pointer rounded-lg
                                ${option.danger
                                ? "text-rose-500 hover:bg-rose-500/10"
                                : "text-neutral-600 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/5"
                            }
                            `}
                        >
                            {option.icon && <span className="shrink-0">{option.icon}</span>}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

ItemOptions.displayName = "ItemOptions";
export default ItemOptions;