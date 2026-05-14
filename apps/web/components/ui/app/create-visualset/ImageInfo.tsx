"use client"
import {useTranslations} from "next-intl";

interface ImageInfoProps {
    activeImageIndex: number;
    title: string;
    onUpdateTitle: (title: string) => void;
}

export default function ImageInfo({title, onUpdateTitle}: ImageInfoProps) {
    const t = useTranslations("createvisualset");

    return (
        <div className="w-full h-full p-5">
            <label className="block text-sm font-semibold text-white mb-2">
                {t("image_title")}
            </label>
            <input
                type="text"
                value={title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="w-full h-12 px-5 rounded-full glass-rgb border border-studoborder/30 text-white outline-none"
                autoComplete="off"
                placeholder={t("image_title_placeholder")}
            />
        </div>
    );
}
