"use client";
import "animate.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IoArrowBackOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import BaseButton from "@/components/ui/design_system/button/BaseButton";

interface LearnDoneProps {
  count: number;
  totalAttempts: number;
  onBack: () => void;
  onRestart: () => void;
}

const LearnDone = ({
  count,
  totalAttempts,
  onBack,
  onRestart,
}: LearnDoneProps) => {
  const t = useTranslations("learn");

  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl 2xl:max-w-4xl px-10">
      <AnimateOnMount className="w-full">
        <div className="w-full h-150">
          <div className="side-a animate__fadeInLeft animate__animate backface-hidden top-0 left-0 absolute w-full shadow-2xl h-full flex items-center justify-center rounded-4xl border border-studoborder/30 bg-linear-45 from-studogrey/30 to to-zinc-200/30 dark:to-zinc-400/20">
            <div className="firework" />
            <div className="firework" />
            <div className="firework" />

            <AnimateOnMount className="w-fit flex flex-col gap-5 items-center justify-center">
              <div className="gap-2 flex-col flex items-center justify-center">
                <Image
                  src="/images/fallbacks/finish.png"
                  width={200}
                  height={200}
                  alt="finish"
                  className="w-auto h-30"
                />
                <span className="font-georgia font-bold text-xl">
                  {t("all_set")}
                </span>
                <span className="text-studogrey">
                  {count} kaarten in {totalAttempts} beurten
                </span>
              </div>

              <div className="w-fit flex flex-row gap-2">
                <BaseButton
                  size="sm"
                  type="button"
                  variant="submit"
                  iconLeft={<IoArrowBackOutline />}
                  label={t("back")}
                  onClick={onBack}
                />
                <BaseButton
                  size="sm"
                  type="button"
                  variant="primary"
                  iconLeft={<GrPowerReset />}
                  label={t("restart")}
                  onClick={onRestart}
                />
              </div>
            </AnimateOnMount>
          </div>
        </div>
      </AnimateOnMount>
    </div>
  );
};

LearnDone.displayName = "LearnDone";
export default LearnDone;
