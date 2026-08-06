"use client";
import ProgressBar from "@/components/ui/app/shared/profile/(modes)/learn/progressbar";
import IntermezzoBar from "@/components/ui/app/shared/profile/(modes)/learn/IntermezzoBar";
import type { Phase } from "@/app/[locale]/(shared)/(modes)/learn/[id]/useLearnCard";

interface LearnProgressProps {
  phase: Phase;
  totalViews: number;
  goal: number;
  errorMode: boolean;
}

const LearnProgress = ({
  phase,
  totalViews,
  goal,
  errorMode,
}: LearnProgressProps) => {
  return (
    <div className="px-5 h-17 flex items-center bg-studogrey/20 rounded-3xl">
      {phase === "intermezzo" ? (
        <IntermezzoBar completedCards={totalViews} setLength={goal} />
      ) : (
        <ProgressBar
          cardLength={goal}
          cardIndex={totalViews}
          phase={phase}
          errorMode={errorMode}
        />
      )}
    </div>
  );
};

LearnProgress.displayName = "LearnProgress";
export default LearnProgress;
