import PageContainer from "@/components/ui/design_system/page/PageContainer";
import AnimateOnMount from "@/components/ui/overige/ui/AnimateOnMount";
import SpeedyMode from "@/components/ui/shared/modes/speedy/SpeedyMode";

export default async function SpeedyPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <AnimateOnMount className={"w-full flex-1 min-h-1/5"}>
        <SpeedyMode id={id} />
      </AnimateOnMount>
    </PageContainer>
  );
}
