import FlashcardMode from "@/components/ui/shared/modes/flashcards/FlashcardMode";
import PageContainer from "@/components/ui/design_system/page/PageContainer";

export default async function FlashCardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <FlashcardMode id={id} />
    </PageContainer>
  );
}
