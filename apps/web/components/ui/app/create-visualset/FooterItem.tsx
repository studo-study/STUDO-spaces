"use client"
import {memo} from "react";
import Image from "next/image"

interface FooterItemProps {
    index: number;
    isActive: boolean;
    previewUrl: string;
    canRemove: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

const FooterItem = memo(function FooterItem({
    index,
    isActive,
    previewUrl,
    canRemove,
    onSelect,
    onRemove
}: FooterItemProps) {
    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (canRemove) {
            onRemove();
        }
    };

    return (
        <div
            onClick={onSelect}
            className="relative min-h-11 max-h-11 min-w-11 max-w-11 cursor-grab rounded-lg active:cursor-grabbing"
        >
            <div
                className={`absolute inset-0 z-10 ${canRemove ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}
                    flex justify-center items-center backdrop-blur-sm bg-black/50 rounded-lg
                    opacity-0 hover:opacity-100 transition-opacity ease-in duration-300`}
            >
                <div
                    className="rounded-full p-2 bg-gradient-to-br from-blue-400 to-blue-500"
                    onClick={handleRemove}
                >
                    <Image
                        width={20}
                        height={20}
                        src="/icons/cross.png"
                        alt="Remove"
                        className="w-3 rotate-45 cursor-pointer invert"
                    />
                </div>
            </div>

            <div
                className={`min-w-11 min-h-11 rounded-lg glass-rgb border border-studoborder/30 flex justify-center items-center overflow-hidden
                    ${isActive ? "ring-2 ring-white ring-offset-0" : ""}`}
            >
                {previewUrl ? (
                    <Image
                        width={20}
                        height={20}
                        src={previewUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        width={20}
                        height={20}
                        src="/icons/image.svg"
                        alt="No image"
                        className="w-7 invert"
                    />
                )}
            </div>
        </div>
    );
});

export default FooterItem;
