"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useImageSuggestions } from "@/hooks/app/sets/useImageSuggestions";
import { IoMdRefresh } from "react-icons/io";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import ImageItem from "@/components/ui/app/private/create-studoset/ImageItem";
import { SuggestionImage } from "@studo/types";

interface ImageSuggestionTabProps {
  term: string | undefined;
  lang?: string;
  selectImage: (value: SuggestionImage | null) => void;
  selected: SuggestionImage | null;
}

const ImageSuggestionTab = ({
  term,
  lang,
  selectImage,
  selected,
}: ImageSuggestionTabProps) => {
  const t = useTranslations("card");
  const [queryTerm, setQueryTerm] = useState(term);
  const { isPending, data, refetch } = useImageSuggestions(queryTerm, lang);

  const handleRefresh = () => {
    setQueryTerm(term);
    refetch();
  };

  const header = (
    <div className={"w-full h-fit flex justify-between items-center"}>
      <span className={"text-sm opacity-50"}>{t("image_suggestion")}:</span>
      <BaseButton
        size={"sm"}
        variant={"outline"}
        icon={<IoMdRefresh />}
        className={""}
        disabled={isPending}
        onClick={handleRefresh}
      />
    </div>
  );

  if (!term) {
    return (
      <div className={"w-full min-h-full gap-2 h-full flex flex-col"}>
        {header}
        <div
          className={"w-full h-full flex items-center justify-center text-sm"}
        >
          {t("no_term")}
        </div>
      </div>
    );
  }

  if (isPending) {
    const cardClass =
      "rounded-2xl hover:border-studoblue overflow-hidden w-full h-full bg-studogrey/30 border border-studoborder/30";
    return (
      <div className={"w-full min-h-full gap-2 h-full flex flex-col"}>
        {header}
        <div className="w-full flex-1 overflow-hidden grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={cardClass} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={"w-full min-h-full gap-2 h-full flex flex-col"}>
      {header}
      {data?.images?.length !== 0 && (
        <div className={"w-full flex-1 overflow-hidden grid grid-cols-4 gap-5"}>
          {data?.images?.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              selected={selected}
              selectImage={selectImage}
            />
          ))}
        </div>
      )}
      {data?.images?.length === 0 && (
        <div
          className={"w-full h-full flex items-center justify-center text-sm"}
        >
          {t("no_suggestions")}
        </div>
      )}
    </div>
  );
};

ImageSuggestionTab.displayName = "ImageSuggestionTab";
export default ImageSuggestionTab;
