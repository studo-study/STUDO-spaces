"use client";
import "animate.css";
import InterMezzoScreen from "@/components/ui/app/shared/profile/(modes)/learn/InterMezzoScreen";
import LearnLoading from "@/components/ui/app/shared/profile/(modes)/learn/learncard/LearnLoading";
import LearnDone from "@/components/ui/app/shared/profile/(modes)/learn/learncard/LearnDone";
import LearnProgress from "@/components/ui/app/shared/profile/(modes)/learn/learncard/LearnProgress";
import CardFace from "@/components/ui/app/shared/profile/(modes)/learn/learncard/CardFace";
import AnswerInput from "@/components/ui/app/shared/profile/(modes)/learn/learncard/AnswerInput";
import { useLearnCard } from "@/app/[locale]/(shared)/(modes)/learn/[id]/useLearnCard";

const LearnCard = () => {
  const card = useLearnCard();

  if (!card.ready) return <LearnLoading onBack={card.goBack} />;

  if (card.phase === "done") {
    return (
      <LearnDone
        count={card.doneCount}
        totalAttempts={card.totalAttempts}
        onBack={card.goBack}
        onRestart={card.restart}
      />
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl 2xl:max-w-4xl px-10">
      <div className="w-full h-150 bg-studogrey/30 border shadow-lg border-neutral-200/30 hover:border-neutral-400 transition-colors duration-300 rounded-4xl flex flex-col justify-between gap-3 p-3">
        <LearnProgress
          phase={card.phase}
          totalViews={card.totalViews}
          goal={card.goal}
          errorMode={card.errorMode}
        />
        {card.phase === "intermezzo" ? (
          <InterMezzoScreen items={card.reviewItems} />
        ) : (
          <>
            <CardFace
              displayWord={card.displayWord}
              corrector={card.corrector}
              imgUrl={card.imgUrl}
              showImage={card.showImage}
              toggleImage={card.toggleImage}
              phase={card.phase}
              wasCorrect={card.wasCorrect}
              showRevision={card.showRevision}
            />
            <AnswerInput
              value={card.value}
              setValue={card.setValue}
              phase={card.phase}
              wasCorrect={card.wasCorrect}
              showRevision={card.showRevision}
              showHint={card.showHint}
              corrector={card.corrector}
              onSubmit={card.submit}
              onHint={card.handleHint}
            />
          </>
        )}
      </div>
    </div>
  );
};

LearnCard.displayName = "LearnCard";
export default LearnCard;
