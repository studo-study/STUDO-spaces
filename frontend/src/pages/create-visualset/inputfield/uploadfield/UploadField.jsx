import { useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Upload from "../../../../../public/assets/icons/uploadpicca.svg";
import PinIcon from "../../../../../public/assets/icons/pin.svg";

const GRID_SIZE = 40;

export default function UploadField({
                                      activeImageIndex,
                                      previewUrl,
                                      pins,
                                      onFileUpload,
                                      onAddPin,
                                      onRemovePinByCoords
                                    }) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0, screenX: 0, screenY: 0 });
  const [definition, setDefinition] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleCellClick = useCallback((x, y, event) => {
    // Check if identify already exists at this position
    const existingPin = pins.find(pin => pin.x === x && pin.y === y);

    if (existingPin) {
      // Remove existing identify
      onRemovePinByCoords(x, y);
      return;
    }

    // Show popup for new identify
    const rect = event.currentTarget.getBoundingClientRect();
    const screenX = rect.left + rect.width / 2;
    const screenY = rect.top + rect.height / 2;

    setPopupPosition({ x, y, screenX, screenY });
    setDefinition("");
    setShowPopup(true);
  }, [pins, onRemovePinByCoords]);

  const handlePopupSubmit = useCallback(() => {
    if (definition.trim()) {
      onAddPin({
        definition: definition.trim(),
        x: popupPosition.x,
        y: popupPosition.y
      });
    }
    setShowPopup(false);
    setDefinition("");
  }, [definition, popupPosition, onAddPin]);

  const handlePopupCancel = useCallback(() => {
    setShowPopup(false);
    setDefinition("");
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePopupSubmit();
    } else if (e.key === "Escape") {
      handlePopupCancel();
    }
  }, [handlePopupSubmit, handlePopupCancel]);

  // Check if a cell has a identify
  const hasPinAt = useCallback((x, y) => {
    return pins.some(pin => pin.x === x && pin.y === y);
  }, [pins]);

  return (
    <div className="w-full h-full relative">

      {!previewUrl && (
        <div
          className="w-160 h-160 flex flex-col items-center justify-center gap-5 cursor-pointer"
          onClick={handleUploadClick}
        >
          <img
            src={Upload}
            alt="Upload"
            className="w-13 h-13 dark:invert dark:brightness-0"
          />
          <span className="text-studodarkblue dark:text-white">
            {t("Click to upload image")}
          </span>
        </div>
      )}


      {previewUrl && (
        <div className="w-160 h-160 relative">
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
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
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
                      src={PinIcon}
                      alt="Identify"
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
            className="absolute bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl
              border border-gray-200 dark:border-gray-700 min-w-64"
            style={{
              left: `${popupPosition.screenX}px`,
              top: `${popupPosition.screenY + 20}px`,
              transform: "translateX(-50%)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="block text-sm font-semibold text-studodarkblue dark:text-white mb-2">
              {t("Type in a definition")}:
            </span>
            <input
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder={t("Definition...")}
              className="w-full px-3 py-2 rounded-full text-sm
                bg-[rgba(255,255,255,0.175)] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)]
                border-b-[1.3px] border-b-[rgba(255,255,255,0.352)] outline-0
                text-studodarkblue dark:text-white dark:bg-gray-700"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handlePopupCancel}
                className="flex-1 py-1.5 px-3 rounded-full text-sm
                  bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white
                  hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                onClick={handlePopupSubmit}
                className="flex-1 py-1.5 px-3 rounded-full text-sm
                  bg-studoblue text-white hover:opacity-90 transition-opacity"
              >
                {t("Add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}