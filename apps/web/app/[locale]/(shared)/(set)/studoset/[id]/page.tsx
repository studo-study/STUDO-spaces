import { auth } from "@/auth";
import StudosetView from "@/app/[locale]/(shared)/(set)/studoset/[id]/studosetview";
import MarketingLayout from "@/components/ui/app/public/PublicChrome";
import StudosetSplashWrapper from "@/app/[locale]/(shared)/(set)/studoset/[id]/StudosetSplashWrapper";
import PublicStudosetView from "@/app/[locale]/(shared)/(set)/studoset/[id]/PublicStudosetview";
import { LearnStoreProvider } from "@/app/[locale]/(shared)/(modes)/learn/[id]/learnStore";

export default async function StudosetPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, auth()]);

  if (session) {
    return (
      <LearnStoreProvider setId={id}>
        <StudosetSplashWrapper id={id}>
          <StudosetView id={id} />
        </StudosetSplashWrapper>
      </LearnStoreProvider>
    );
  }
  return (
    <MarketingLayout>
      <div className="w-full scroll-hidden mt-10 dark:text-white md:mt-0 min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 max-w-200 flex-col items-center justify-center gap-3 sm:gap-5 scroll-hidden">
          <StudosetSplashWrapper id={id}>
            <PublicStudosetView id={id} />
          </StudosetSplashWrapper>
        </div>
      </div>
    </MarketingLayout>
  );
}
