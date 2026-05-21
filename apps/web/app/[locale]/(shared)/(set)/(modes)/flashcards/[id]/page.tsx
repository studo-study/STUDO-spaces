import { auth } from "@/auth";
import FlashcardMode from "@/components/ui/shared/modes/flashcards/FlashcardMode";
import PageContainer from "@/components/ui/design_system/page/PageContainer";

export default async function FlashCardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const token = session?.accessToken;

  const data = await fetch(`${process.env.AUTH_API_URL}/studysets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  }).then((res) => res.json());

  return (
    <PageContainer>
      <FlashcardMode id={id} cards={data?.cards} />
    </PageContainer>
  );
}
