import { auth } from "@/auth";
import LearnController from "@/app/[locale]/(shared)/(modes)/learn/[id]/learncontroller";
import { LearnStoreProvider } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";
import AnimateOnMount from "@/components/ui/overige/effects/AnimateOnMount";
import LinkButton from "@studo/ui/design_system/button/LinkButton";
import { ArrowLeft } from "lucide-react";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const token = session?.accessToken;
  const data = await fetch(`${process.env.AUTH_API_URL}/studysets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  }).then((res) => res.json());

  // zelfde verticale framing als de flashcard-pagina (PageContainer), maar
  // zonder de max-width zodat de bredere learn-card niet geclipt wordt
  return (
    <div className="w-full h-full flex flex-col items-center justify-center 2xl:py-15 xl:py-5 2xl:pt-5 scroll-hidden dark:text-white text-studodarkblue">
      <LinkButton
        href={"/studoset/" + id}
        variant={"icon"}
        icon={<ArrowLeft size={15} />}
        className={"absolute left-5 top-5 z-999"}
      />
      <div className="relative w-full min-h-full h-full gap-5 flex items-center flex-col scroll-hidden">
        <AnimateOnMount className="w-full flex-1 min-h-1/5">
          <LearnStoreProvider setId={id}>
            <LearnController data={data} />
          </LearnStoreProvider>
        </AnimateOnMount>
      </div>
    </div>
  );
}
