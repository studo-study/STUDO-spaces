"use client";
import { ReactNode } from "react";
import PageContainer from "@/components/ui/design_system/page/PageContainer";
import SearchHeader from "@/components/ui/app/shared/search/searchheader";
import { useSearchParams } from "next/navigation";
import { useSearchResult } from "@/hooks/app/search/useSearchResult";
import NoResult from "@/components/ui/app/shared/search/noresult";
import { useSession } from "next-auth/react";
import AuthLayout from "@/app/[locale]/(app)/layout";

export default function SearchResultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const session = useSession();
  const query = searchParams.get("q");
  const result = useSearchResult(query ?? "").data;

  const size =
    result &&
    result.data[0].data.length +
      result.data[1].data.length +
      result.data[2].data.length +
      result.data[3].data.length;
  console.log(result);

  if (session) {
    return (
      <AuthLayout>
        <div className={"w-full"}>
          <SearchHeader query={query} size={size} />
        </div>
        {size === 0 ? (
          <div
            className={"w-full h-full flex flex-1 items-center justify-center"}
          >
            <NoResult />
          </div>
        ) : (
          <div className={"min-h-0 min-w-full flex-1 h-fit"}>{children}</div>
        )}
      </AuthLayout>
    );
  }
  return (
    <div
      className={`w-full dark:text-white text-studodarkblue
          max-h-screen min-h-[90vh] pt-35 h-screen flex flex-col justify-baseline items-center
          bg-gradient-to-b from-transparent via-transparent to-emerald-300/10`}
    >
      <PageContainer className={"w-full"}>
        <div className={"w-full"}>
          <SearchHeader query={query} size={size} />
        </div>
        {size === 0 ? (
          <div
            className={"w-full h-full flex flex-1 items-center justify-center"}
          >
            <NoResult />
          </div>
        ) : (
          <div className={"min-h-0 min-w-full flex-1 h-fit"}>{children}</div>
        )}
      </PageContainer>
    </div>
  );
}
