"use client";
import { useTranslations } from "next-intl";
import { ArrowRight, CircleQuestionMark } from "lucide-react";
import classNames from "@/utils/classnames";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import HintCanvas from "@/app/[locale]/(shared)/(modes)/learn/[id]/HintCanvas";
import type { Phase } from "@/app/[locale]/(shared)/(modes)/learn/[id]/useLearnCard";

interface AnswerInputProps {
  value: string;
  setValue: (value: string) => void;
  phase: Phase;
  wasCorrect: boolean;
  showRevision: boolean;
  showHint: boolean;
  corrector?: string;
  onSubmit: () => void;
  onHint: () => void;
}

const AnswerInput = ({
  value,
  setValue,
  phase,
  wasCorrect,
  showRevision,
  showHint,
  corrector,
  onSubmit,
  onHint,
}: AnswerInputProps) => {
  const t = useTranslations("learn");

  return (
    <div className="flex flex-col">
      <div className="h-10 pl-5 mb-2 flex flex-row justify-between items-center">
        <div>
          {phase === "input" && showHint && (
            <HintCanvas currentCard={corrector ?? ""} />
          )}
          {phase === "feedback" && !wasCorrect && (
            <span className="text-sm dark:text-studogrey text-black/30">
              {t("enter_continue")}
            </span>
          )}
        </div>
        <div className="flex flex-row gap-1 w-fit">
          <BaseButton
            size="sm"
            variant="outline_link"
            className="truncate"
            iconLeft={<CircleQuestionMark size={15} />}
            onClick={onHint}
            isDisabled={showHint}
          >
            {t("hint")}
          </BaseButton>
          <BaseButton
            size="sm"
            variant="outline_link"
            className="truncate"
            iconLeft={<ArrowRight size={15} />}
            onClick={() => {
              setValue("");
              onSubmit();
            }}
          >
            {t("next")}
          </BaseButton>
        </div>
      </div>
      <div
        className={classNames(
          "w-full focus-within:ring-2 h-15 rounded-3xl bg-studogrey/30 px-5 flex items-center flex-row",
          phase === "feedback"
            ? wasCorrect
              ? "ring-2 ring-emerald-500 bg-emerald-800/30"
              : "ring-2 ring-rose-500 bg-rose-800/30"
            : showRevision
              ? "ring-amber-500"
              : "ring-studoblue",
        )}
      >
        <input
          autoFocus
          className="outline-none w-full bg-transparent"
          placeholder={t("type_answer")}
          value={value}
          readOnly={phase === "feedback"}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (phase === "input") onSubmit();
          }}
        />
      </div>
    </div>
  );
};

AnswerInput.displayName = "AnswerInput";
export default AnswerInput;
