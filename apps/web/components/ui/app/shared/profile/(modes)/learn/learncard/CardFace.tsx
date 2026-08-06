"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import classNames from "@/utils/classnames";
import type { Phase } from "@/app/[locale]/(shared)/(modes)/learn/[id]/useLearnCard";

interface CardFaceProps {
  displayWord?: string;
  corrector?: string;
  imgUrl?: string;
  showImage: boolean;
  toggleImage: () => void;
  phase: Phase;
  wasCorrect: boolean;
  showRevision: boolean;
}

const wordClass = (word?: string) =>
  classNames(
    "w-full text-3xl text-center font-semibold font-georgia",
    word && word.length > 30 && "text-2xl",
    word && word.length > 50 && "text-xl",
    word && word.length > 85 && "text-lg",
    word && word.length > 120 && "text-base",
  );

const CardFace = ({
  displayWord,
  corrector,
  imgUrl,
  showImage,
  toggleImage,
  phase,
  wasCorrect,
  showRevision,
}: CardFaceProps) => {
  const t = useTranslations("learn");

  return (
    <div className="min-w-0 min-h-0 px-10 pt-10 flex-1 flex flex-col items-center justify-center gap-4">
      {showRevision && (
        <span className="text-sm font-bold uppercase text-amber-500">
          {t("revision")}
        </span>
      )}
      {imgUrl ? (
        <div
          className="h-full flex justify-center items-center cursor-pointer"
          onClick={toggleImage}
        >
          {showImage ? (
            <div className="overflow-hidden h-full min-w-fit rounded-3xl">
              <Image
                src={imgUrl}
                alt="image"
                width={200}
                height={200}
                className="h-full"
              />
            </div>
          ) : (
            <span className={wordClass(displayWord)}>{displayWord}</span>
          )}
        </div>
      ) : (
        <span className={wordClass(displayWord)}>{displayWord}</span>
      )}
      {phase === "feedback" && (
        <span
          className={classNames(
            "text-xl font-medium",
            !wasCorrect ? "text-rose-500" : "text-emerald-500",
          )}
        >
          {corrector}
        </span>
      )}
    </div>
  );
};

CardFace.displayName = "CardFace";
export default CardFace;
