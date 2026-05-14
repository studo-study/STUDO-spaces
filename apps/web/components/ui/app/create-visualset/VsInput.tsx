"use client"
import UploadField from "@/components/ui/app/create-visualset/UploadField";
import ImageInfo from "@/components/ui/app/create-visualset/ImageInfo";
import ItemOverview from "@/components/ui/app/create-visualset/ItemOverview";
import {VisualsetImage} from "@/components/ui/app/create-visualset/CreateVisualset";
import {Pin} from "@/types/types";

interface VsInputProps {
    activeImageIndex: number;
    currentImage: VisualsetImage;
    onFileUpload: (file: File) => void;
    onAddPin: (pin: Omit<Pin, 'id' | 'number' | 'created_at' | 'updated_at' | 'image_id' | 'set_id' | 'owner_id'>) => void;
    onRemovePin: (index: number) => void;
    onRemovePinByCoords: (x: number, y: number) => void;
    onUpdateImageTitle: (title: string) => void;
}

export default function VsInput({
    activeImageIndex,
    currentImage,
    onFileUpload,
    onAddPin,
    onRemovePin,
    onRemovePinByCoords,
    onUpdateImageTitle
}: VsInputProps) {
    return (
        <div className="flex w-full flex-col lg:flex-row items-start justify-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-full lg:min-w-[640px] lg:w-auto aspect-square lg:aspect-auto lg:min-h-[640px]
                glass-rgb border border-studoborder/30 rounded-2xl sm:rounded-4xl overflow-hidden">
                <UploadField
                    activeImageIndex={activeImageIndex}
                    previewUrl={currentImage?.previewUrl}
                    pins={currentImage?.pins || []}
                    onFileUpload={onFileUpload}
                    onAddPin={onAddPin}
                    onRemovePinByCoords={onRemovePinByCoords}
                />
            </div>

            <div className="w-full lg:min-w-80 lg:w-80 min-h-[400px] lg:min-h-[640px] flex flex-col gap-3 sm:gap-4 md:gap-5">
                <div className="min-h-fit w-full flex flex-col glass-rgb border border-studoborder/30 rounded-2xl sm:rounded-4xl">
                    <ImageInfo
                        activeImageIndex={activeImageIndex}
                        title={currentImage?.title || ""}
                        onUpdateTitle={onUpdateImageTitle}
                    />
                </div>

                <div className="flex-1 w-full flex flex-col glass-rgb border border-studoborder/30 rounded-2xl sm:rounded-4xl overflow-hidden">
                    <ItemOverview
                        pins={currentImage?.pins || []}
                        onRemovePin={onRemovePin}
                    />
                </div>
            </div>
        </div>
    );
}
