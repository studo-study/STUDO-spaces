import FlashcardMode from "@/components/ui/app/shared/studosets/modes/flashcards/FlashcardMode";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";

export default async function FlashCardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <AnimateOnMount className={"w-full flex-1 min-h-1/5"}>
        <FlashcardMode id={id} />
      </AnimateOnMount>
    </PageContainer>
  );
}
