import LearnCard from "@/app/[locale]/(shared)/(modes)/learn/[id]/LearnCard";
import type { FullStudysetResponse } from "@studo/types";

const Learncontroller = ({ data }: { data?: FullStudysetResponse }) => {
  void data;
  return (
    <div className={"w-full h-full flex justify-center items-center"}>
      <LearnCard />
    </div>
  );
};

Learncontroller.displayName = "Learncontroller";
export default Learncontroller;
