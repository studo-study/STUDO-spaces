"use client";
import { memo } from "react";
import { useTranslations } from "next-intl";
import { IoClose } from "react-icons/io5";
import { Pin } from "@/types/types";

interface ItemOverviewProps {
  pins: Pin[];
  onRemovePin: (index: number) => void;
}

const ItemOverview = memo(function ItemOverview({
  pins,
  onRemovePin,
}: ItemOverviewProps) {
  const t = useTranslations("createvisualset");

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-3 sm:p-4 md:p-5 border-b border-studoborder/30">
        <span className="font-semibold text-xs sm:text-sm text-white">
          {t("pins")} ({pins.length})
        </span>
      </div>

      <ul className="flex-1 overflow-y-auto p-2 sm:p-3">
        {pins.length === 0 ? (
          <li className="text-center text-gray-400 py-6 sm:py-8 text-xs sm:text-sm px-2">
            {t("click_to_add_pins")}
          </li>
        ) : (
          pins.map((pin, index) => (
            <li
              key={`${pin.x}-${pin.y}-${index}`}
              className="flex items-center justify-between p-2 sm:p-3 mb-2
                                glass-rgb border border-studoborder/30 rounded-xl
                                hover:opacity-80 transition-opacity
                                cursor-pointer group"
              onClick={() => onRemovePin(index)}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0
                                    bg-gradient-to-br from-blue-400 to-blue-500 text-white text-[10px] sm:text-xs font-bold rounded-full"
                >
                  {index + 1}
                </span>
                <span className="text-white text-xs sm:text-sm truncate">
                  {pin.definition}
                </span>
              </div>
              <IoClose
                className="text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                size={16}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
});

export default ItemOverview;
