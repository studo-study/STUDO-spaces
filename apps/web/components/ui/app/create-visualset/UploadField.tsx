"use client"
import {useRef, useState, useCallback} from "react";
import {useTranslations} from "next-intl";
import {Pin} from "@/types/types";

const GRID_SIZE = 40;

interface UploadFieldProps {
    activeImageIndex: number;
    previewUrl: string;
    pins: Pin[];
    onFileUpload: (file: File) => void;
    onAddPin: (pin: Omit<Pin, 'id' | 'number' | 'created_at' | 'updated_at' | 'image_id' | 'set_id' | 'owner_id'>) => void;
    onRemovePinByCoords: (x: number, y: number) => void;
}

export default function UploadField({
    activeImageIndex,
    previewUrl,
    pins,
    onFileUpload,
    onAddPin,
    onRemovePinByCoords
}: UploadFieldProps) {
    const t = useTranslations("createvisualset");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0, screenX: 0, screenY: 0});
    const [definition, setDefinition] = useState("");

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    }, [onFileUpload]);

    const handleCellClick = useCallback((x: number, y: number, event: React.MouseEvent) => {
        const existingPin = pins.find(pin => pin.x === x && pin.y === y);

        if (existingPin) {
            onRemovePinByCoords(x, y);
            return;
        }

        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const screenX = rect.left + rect.width / 2;
        const screenY = rect.top + rect.height / 2;

        setPopupPosition({x, y, screenX, screenY});
        setDefinition("");
        setShowPopup(true);
    }, [pins, onRemovePinByCoords]);

    const handlePopupSubmit = useCallback(() => {
        if (definition.trim()) {
            onAddPin({
                definition: definition.trim(),
                x: popupPosition.x,
                y: popupPosition.y
            } as Pin);
        }
        setShowPopup(false);
        setDefinition("");
    }, [definition, popupPosition, onAddPin]);

    const handlePopupCancel = useCallback(() => {
        setShowPopup(false);
        setDefinition("");
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handlePopupSubmit();
        } else if (e.key === "Escape") {
            handlePopupCancel();
        }
    }, [handlePopupSubmit, handlePopupCancel]);

    const hasPinAt = useCallback((x: number, y: number) => {
        return pins.some(pin => pin.x === x && pin.y === y);
    }, [pins]);

    return (
        <div className="w-full h-full relative">
            {!previewUrl && (
                <div
                    className="w-full min-h-[640px] flex flex-col items-center justify-center gap-5 cursor-pointer"
                    onClick={handleUploadClick}
                >
                    <img
                        src="/icons/uploadpicca.svg"
                        alt="Upload"
                        className="w-13 h-13 dark:invert dark:brightness-0"
                    />
                    <span className="text-white">
                        {t("click_to_upload")}
                    </span>
                </div>
            )}

            {previewUrl && (
                <div className="w-full aspect-square relative">
                    <img
                        src={previewUrl}
                        alt="Uploaded"
                        className="absolute inset-0 w-full h-full object-contain"
                    />

                    <div
                        className="absolute inset-0 grid"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
                        }}
                    >
                        {Array.from({length: GRID_SIZE * GRID_SIZE}).map((_, index) => {
                            const x = index % GRID_SIZE;
                            const y = Math.floor(index / GRID_SIZE);
                            const hasPin = hasPinAt(x, y);

                            return (
                                <div
                                    key={index}
                                    onClick={(e) => handleCellClick(x, y, e)}
                                    className="relative cursor-pointer hover:bg-studoblue/20 transition-colors
                                        border border-transparent hover:border-studoblue/30"
                                >
                                    {hasPin && (
                                        <img
                                            src="/icons/pin.svg"
                                            alt="Pin"
                                            className="absolute inset-0 w-full h-full p-0.5 drop-shadow-md"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                className="hidden"
            />

            {showPopup && (
                <div
                    className="fixed inset-0 z-50"
                    onClick={handlePopupCancel}
                >
                    <div
                        className="absolute glass-rgb border border-studoborder/30 rounded-2xl p-4 shadow-2xl min-w-64"
                        style={{
                            left: `${popupPosition.screenX}px`,
                            top: `${popupPosition.screenY + 20}px`,
                            transform: "translateX(-50%)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="block text-sm font-semibold text-white mb-2">
                            {t("type_definition")}:
                        </span>
                        <input
                            type="text"
                            value={definition}
                            onChange={(e) => setDefinition(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder={t("definition_placeholder")}
                            className="w-full h-10 px-4 rounded-full glass-rgb border border-studoborder/30 text-white outline-none text-sm"
                        />
                        <div className="flex gap-2 mt-3">
                            <button
                                type="button"
                                onClick={handlePopupCancel}
                                className="flex-1 py-1.5 px-3 rounded-full text-sm
                                    glass-rgb border border-studoborder/30 text-white
                                    hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={handlePopupSubmit}
                                className="flex-1 py-1.5 px-3 rounded-full text-sm
                                    bg-gradient-to-br from-blue-400 to-blue-500 text-white
                                    border border-studoborder hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                {t("add")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
