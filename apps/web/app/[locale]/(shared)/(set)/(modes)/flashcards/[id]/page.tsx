import FlashcardMode from "@/components/ui/shared/modes/flashcards/FlashcardMode";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";

export default async function FlashCardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <AnimateOnMount className={"w-full h-full flex-1"}>
        <FlashcardMode id={id} />
      </AnimateOnMount>
    </PageContainer>
  );
}
