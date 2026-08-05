import FlashcardMode from "@/components/ui/app/shared/studosets/modes/flashcards/FlashcardMode";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import LinkButton from "@/components/ui/design_system/button/LinkButton";
import { ArrowLeft } from "lucide-react";

export default async function FlashCardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <LinkButton
        href={"/studoset/" + id}
        variant={"icon"}
        icon={<ArrowLeft size={15} />}
        className={
          "absolute left-5 top-5 z-999 dark:text-white text-studodarkblue"
        }
      />
      <PageContainer>
        <AnimateOnMount className="w-full flex-1 min-h-0">
          <FlashcardMode id={id} />
        </AnimateOnMount>
      </PageContainer>
    </>
  );
}
