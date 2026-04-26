import UploadField from "./uploadfield/UploadField.jsx";
import ImageInfo from "./imageinfo/ImageInfo.jsx";
import ItemOverview from "./itemoverview/ItemOverview.jsx";

export default function VsInput({
                                  activeImageIndex,
                                  currentImage,
                                  onFileUpload,
                                  onAddPin,
                                  onRemovePin,
                                  onRemovePinByCoords
                                }) {
  return (
    <div className="flex w-full flex-col lg:flex-row items-start justify-center gap-3 sm:gap-4 md:gap-5 scroll-hidden">

      <div className="w-full lg:min-w-[640px] lg:w-auto aspect-square lg:aspect-auto lg:min-h-[640px]
        bg-studogrey rounded-2xl sm:rounded-4xl overflow-hidden">
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
        <div className="min-h-fit w-full flex flex-col bg-studogrey rounded-2xl sm:rounded-4xl">
          <ImageInfo activeImageIndex={activeImageIndex} />
        </div>

        <div className="flex-1 w-full flex flex-col bg-studogrey rounded-2xl sm:rounded-4xl overflow-hidden">
          <ItemOverview
            pins={currentImage?.pins || []}
            onRemovePin={onRemovePin}
          />
        </div>
      </div>
    </div>
  );
}