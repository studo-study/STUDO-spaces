import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Left from "../../../assets/icons/left.svg";
import PinIcon from "../../../assets/icons/pin.svg";

const GRID_SIZE = 40;

export default function ImageComponent({ images, activeImageIndex = 0, onImageChange }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(activeImageIndex);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [animate, setAnimate] = useState(false);


  useEffect(() => {
    if (onImageChange) {
      setCurrentIndex(activeImageIndex);
    }
  }, [activeImageIndex, onImageChange]);

  const currentImage = images?.[currentIndex];
  const pins = currentImage?.pins?.pins || currentImage?.pins || [];

  const goNext = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    if (onImageChange) onImageChange(newIndex);
  };

  const goPrev = () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    if (onImageChange) onImageChange(newIndex);
  };

  const getPinAt = (x, y) => {
    return pins.find(pin => pin.x === x && pin.y === y);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square max-w-[640px] mx-auto flex items-center justify-center
        bg-studowhite rounded-4xl border-[0.5px] border-solid
        border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
        dark:bg-gray-700 dark:border-t-gray-500 dark:border-l-gray-500">
        <span className="text-gray-500 dark:text-gray-400">{t("No images available")}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">

      <div
        className={`relative w-full aspect-square max-w-[640px] mx-auto overflow-hidden
          bg-studowhite rounded-4xl
          shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe]
          dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
          border-[0.5px] border-solid dark:border-t-gray-500 dark:border-l-gray-500
          border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
          ${animate ? "animate__animated animate__fadeIn animate__faster" : ""}`}
      >

        <img
          src={currentImage.url}
          alt={currentImage.title || `Image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Grid overlay - exact same structure as UploadField */}
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
            const pin = getPinAt(x, y);

            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => pin && setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {pin && (
                  <>
                    <img
                      src={PinIcon}
                      alt="Identify"
                      className={`absolute inset-0 w-full h-full p-0.5 drop-shadow-md
                        transition-transform duration-200 cursor-pointer
                        ${hoveredPin?.id === pin.id || (hoveredPin?.x === pin.x && hoveredPin?.y === pin.y)
                        ? "scale-125 z-20"
                        : "z-10"}`}
                    />
                    {/* Tooltip on hover */}
                    {(hoveredPin?.id === pin.id || (hoveredPin?.x === pin.x && hoveredPin?.y === pin.y)) && (
                      <div
                        className="absolute z-50 bg-studodarkblue text-white text-sm
                          px-3 py-2 rounded-xl whitespace-nowrap shadow-lg
                          animate__animated animate__fadeIn animate__faster pointer-events-none"
                        style={{
                          left: "50%",
                          transform: "translateX(-50%)",
                          top: "100%",
                          marginTop: "8px"
                        }}
                      >
                        <span className="font-semibold mr-1">{pin.number || pins.indexOf(pin) + 1}.</span>
                        {pin.definition}
                        <div
                          className="absolute -top-1 left-1/2 -translate-x-1/2
                            w-2 h-2 bg-studodarkblue rotate-45"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Image title overlay */}
        {currentImage.title && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white
            px-4 py-2 rounded-xl text-sm backdrop-blur-sm z-30">
            {currentImage.title}
          </div>
        )}

        {/* Identify count indicator */}
        <div className="absolute top-4 right-4 bg-studoblue text-white
          px-3 py-1 rounded-full text-sm font-medium shadow-md z-30">
          {pins.length} {pins.length === 1 ? t("pin") : t("pins")}
        </div>
      </div>

      {/* Navigation controls - only show if multiple images */}
      {images.length > 1 && (
        <div className="w-full h-fit flex flex-row justify-center items-center gap-5">
          {/* Previous button */}
          <div
            onClick={goPrev}
            className="flex justify-center items-center dark:border-gray-700 min-w-12 h-12 rounded-full
              dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white cursor-pointer hover:scale-105 transition-transform">
            <img src={Left} alt="Previous" className="h-8 dark:invert dark:brightness-0" />
          </div>

          {/* Image counter */}
          <div className="flex justify-center items-center dark:border-gray-700 min-w-25 h-12 rounded-full
            dark:border-t-gray-500 dark:border-l-border-gray-500
            border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
            shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a] pl-8 pr-8
            dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
            dark:text-white font-atrament text-xl">
            <span className="font-sfpro text-base flex flex-row justify-center">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Next button */}
          <div
            onClick={goNext}
            className="flex justify-center items-center dark:border-gray-700 w-12 h-12 rounded-full
              dark:border-t-gray-500 dark:border-l-border-gray-500
              border-[0.5px] border-solid border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]
              shadow-[3px_3px_6px_#35557138,_-3px_-3px_6px_#ffffff4a]
              dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
              dark:text-white cursor-pointer hover:scale-105 transition-transform">
            <img src={Left} alt="Next" className="h-8 dark:invert dark:brightness-0 rotate-180" />
          </div>
        </div>
      )}

      {/* Image thumbnails - only show if multiple images */}
      {images.length > 1 && (
        <div className="w-full flex flex-row gap-2 justify-center overflow-x-auto py-2">
          {images.map((img, index) => (
            <div
              key={img.id || index}
              onClick={() => {
                setCurrentIndex(index);
                if (onImageChange) onImageChange(index);
              }}
              className={`min-w-16 h-16 rounded-xl overflow-hidden cursor-pointer
                transition-all duration-200 
                ${currentIndex === index
                ? "ring-3 ring-white"
                : "opacity-60 hover:opacity-100"}`}
            >
              <img
                src={img.url}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}