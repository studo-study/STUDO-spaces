"use client"
import Image from "next/image";
import {useEffect, useRef} from "react";
import {useTranslations} from "next-intl";
import Sortable from "sortablejs";
import FooterItem from "@/components/ui/app/create-visualset/FooterItem";
import {VisualsetImage} from "@/components/ui/app/create-visualset/CreateVisualset";

interface VsFooterProps {
    images: VisualsetImage[];
    activeIndex: number;
    onSelectImage: (index: number) => void;
    onAddImage: () => void;
    onRemoveImage: (index: number) => void;
    onReorderImages: (fromIndex: number, toIndex: number) => void;
    isMutating: boolean;
}

export default function VsFooter({
    images,
    activeIndex,
    onSelectImage,
    onAddImage,
    onRemoveImage,
    onReorderImages,
    isMutating
}: VsFooterProps) {
    const t = useTranslations("createvisualset");
    const containerRef = useRef<HTMLDivElement>(null);
    const sortableRef = useRef<Sortable | null>(null);

    useEffect(() => {
        if (containerRef.current && !sortableRef.current) {
            sortableRef.current = new Sortable(containerRef.current, {
                animation: 150,
                ghostClass: "opacity-50",
                onEnd: (evt) => {
                    const {oldIndex, newIndex} = evt;
                    if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
                        onReorderImages(oldIndex, newIndex);
                    }
                }
            });
        }

        return () => {
            if (sortableRef.current) {
                sortableRef.current.destroy();
                sortableRef.current = null;
            }
        };
    }, [onReorderImages]);

    return (
        <div className="w-full h-auto min-h-[68px] sm:min-h-[76px]
            glass-rgb border border-studoborder/30 rounded-2xl sm:rounded-4xl
            flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center
            p-2 sm:p-3 justify-between overflow-visible">

            <div
                onClick={onAddImage}
                className="h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 flex justify-center items-center
                    rounded-lg cursor-pointer glass-rgb border border-studoborder/30
                    hover:opacity-80 transition-opacity self-start sm:self-auto"
            >
                <Image src="/icons/plus.svg" width={20} height={20} className="h-4 sm:h-5 invert" alt="Add"/>
            </div>

            <div
                ref={containerRef}
                className="h-10 sm:h-12 w-full px-0.5 sm:px-0.75
                    items-center rounded-lg gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden
                    flex flex-row"
            >
                {images.map((image, index) => (
                    <FooterItem
                        key={image.id}
                        index={index}
                        isActive={activeIndex === index}
                        previewUrl={image.previewUrl}
                        canRemove={images.length > 1}
                        onSelect={() => onSelectImage(index)}
                        onRemove={() => onRemoveImage(index)}
                    />
                ))}
            </div>

            <button
                type="submit"
                disabled={isMutating}
                className="h-10 sm:h-11 min-w-fit px-4 sm:px-5
                    cursor-pointer flex justify-center items-center
                    rounded-full font-bold text-xs sm:text-sm
                    active:scale-105 transition-transform z-[2]
                    bg-gradient-to-br from-blue-400 to-blue-500 text-white
                    border border-studoborder shadow-2xl
                    disabled:opacity-50 flex-shrink-0"
            >
                {isMutating ? t("saving") : t("create")}
            </button>
        </div>
    );
}
