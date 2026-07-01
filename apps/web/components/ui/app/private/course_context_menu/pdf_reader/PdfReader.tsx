"use client";
import DoubleButton from "@/components/ui/design_system/button/DoubleButton";
import { ChevronDown, ChevronUp } from "lucide-react";
import ToggleAbleSearchbar from "@/components/ui/design_system/search/ToggleAbleSearchbar";
import PdfIndex from "@/components/ui/app/private/course_context_menu/pdf_reader/PdfIndex";
import { useRef } from "react";
import PdfCanvas from "@/components/ui/app/private/course_context_menu/pdf_reader/PdfCanvas";

const PdfReader: React.FC = () => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  return (
    <div className={"w-full min-h-0 flex flex-col bg-studogrey/5 flex-1"}>
      <div className={"flex flex-row justify-end p-5 gap-3"}>
        <ToggleAbleSearchbar />
        <DoubleButton
          buttonIconLeft={<ChevronUp />}
          buttonIconRight={<ChevronDown />}
        />
      </div>
      <div
        className={
          "relative flex flex-row flex-1 min-h-0 justify-center items-center overflow-hidden"
        }
      >
        <div className={"absolute w-30 h-full  left-0"}>
          <PdfIndex sectionRefs={sectionRefs} />
        </div>
        <div
          className={
            "w-full h-full min-h-0 overflow-y-auto overflow-x-hidden scroll-hidden"
          }
        >
          <PdfCanvas />
        </div>
      </div>
    </div>
  );
};

PdfReader.displayName = "PdfReader";
export default PdfReader;
