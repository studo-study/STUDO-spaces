"use client";
import BaseButton from "@/components/ui/design_system/button/BaseButton";
import { IoArrowBackOutline } from "react-icons/io5";

interface LearnLoadingProps {
  onBack: () => void;
}

const LearnLoading = ({ onBack }: LearnLoadingProps) => {
  return (
    <div className="flex flex-col gap-10 min-h-190 w-full max-w-2xl 2xl:max-w-4xl px-10">
      <div className="w-full flex flex-row">
        <BaseButton size="sm" variant="icon" onClick={onBack}>
          <IoArrowBackOutline />
        </BaseButton>
      </div>
      <div className="w-full h-150 flex items-center justify-center text-studogrey">
        ...
      </div>
    </div>
  );
};

LearnLoading.displayName = "LearnLoading";
export default LearnLoading;
